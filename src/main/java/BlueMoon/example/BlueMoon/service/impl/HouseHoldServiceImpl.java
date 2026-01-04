package BlueMoon.example.BlueMoon.service.impl;

import BlueMoon.example.BlueMoon.dto.request.HouseHoldSelectRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdCreateRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdUpdateRequest;
import BlueMoon.example.BlueMoon.dto.request.StayAbsenceRequest;
import BlueMoon.example.BlueMoon.dto.response.ApartmentSimpleResponse;
import BlueMoon.example.BlueMoon.dto.response.HouseholdResponse;
import BlueMoon.example.BlueMoon.dto.response.ResidenceHistoryResponse;
import BlueMoon.example.BlueMoon.dto.response.StayAbsenceRecordResponse;
import BlueMoon.example.BlueMoon.entity.ApartmentEntity;
import BlueMoon.example.BlueMoon.entity.ChangeHistoryEntity;
import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import BlueMoon.example.BlueMoon.entity.StayAbsenceRecordEntity;
import BlueMoon.example.BlueMoon.serializable.ChangeHistoryId;
import BlueMoon.example.BlueMoon.mapper.HouseholdMapper;
import BlueMoon.example.BlueMoon.repository.resident.ApartmentRepository;
import BlueMoon.example.BlueMoon.repository.resident.ChangeHistoryRepository;
import BlueMoon.example.BlueMoon.repository.resident.HouseHoldRepository;
import BlueMoon.example.BlueMoon.repository.resident.ResidentRepository;
import BlueMoon.example.BlueMoon.repository.resident.StayAbsenceRecordRepository;
import BlueMoon.example.BlueMoon.service.HouseHoldService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HouseHoldServiceImpl implements HouseHoldService {

    @Autowired
    private HouseHoldRepository houseHoldRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private HouseholdMapper householdMapper;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private ChangeHistoryRepository changeHistoryRepository;

    @Autowired
    private StayAbsenceRecordRepository stayAbsenceRecordRepository;

    @Override
    public List<HouseholdResponse> searchHouseHolds(HouseHoldSelectRequest request) {
        Specification<HouseholdEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // IMPORTANT: Add JOIN FETCH to eagerly load residents and apartment (avoid N+1
            // query)
            if (query != null) {
                root.fetch("residents", JoinType.LEFT);
                root.fetch("apartment", JoinType.LEFT);
                query.distinct(true); // Avoid duplicates from join
            }

            // Tìm kiếm theo searchKeyword
            if (request.getSearchKeyword() != null && !request.getSearchKeyword().trim().isEmpty()) {
                String keyword = request.getSearchKeyword().trim();

                List<Predicate> keywordPredicates = new ArrayList<>();

                // 1. Tìm theo household ID - EXACT MATCH
                try {
                    Long householdId = Long.parseLong(keyword);
                    keywordPredicates.add(criteriaBuilder.equal(root.get("householdId"), householdId));
                } catch (NumberFormatException e) {
                    // Không phải số, bỏ qua điều kiện này
                }

                // 2. Tìm theo số phòng (room_number) - EXACT MATCH
                try {
                    Long roomNumber = Long.parseLong(keyword);
                    // Tìm theo roomNumber của apartment
                    keywordPredicates.add(criteriaBuilder.equal(root.get("apartment").get("roomNumber"), roomNumber));
                } catch (NumberFormatException e) {
                    // Không phải số, bỏ qua điều kiện này
                }

                // 3. Tìm theo tên chủ hộ
                // Tìm các resident có tên khớp với keyword
                String keywordPattern = "%" + keyword.toLowerCase() + "%";
                List<ResidentsEntity> matchingResidents = residentRepository.findAll(
                        (residentRoot, residentQuery, cb) -> {
                            return cb.like(
                                    cb.lower(residentRoot.get("fullName")),
                                    keywordPattern);
                        });

                // Lấy danh sách resident IDs và thêm vào điều kiện tìm kiếm
                if (!matchingResidents.isEmpty()) {
                    List<Long> residentIds = matchingResidents.stream()
                            .map(ResidentsEntity::getResidentId)
                            .toList();

                    // Tìm household có headOfHousehold trong danh sách này
                    keywordPredicates.add(root.get("headOfHousehold").in(residentIds));
                }

                // Kết hợp các điều kiện tìm kiếm bằng OR
                if (!keywordPredicates.isEmpty()) {
                    predicates.add(criteriaBuilder.or(keywordPredicates.toArray(new Predicate[0])));
                }
            }

            // Lọc theo status
            if (request.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), request.getStatus().toString()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // Sort by status DESC (1 first, then 0), then by householdId ASC
        List<HouseholdEntity> entities = houseHoldRepository.findAll(spec,
                Sort.by(Sort.Direction.DESC, "status")
                        .and(Sort.by(Sort.Direction.ASC, "householdId")));

        // Kiểm tra nếu không tìm thấy kết quả
        if (entities.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy hộ khẩu nào phù hợp với tiêu chí tìm kiếm");
        }

        return householdMapper.toHouseholdResponses(entities);
    }

    @Override
    public List<ApartmentSimpleResponse> getAvailableApartments() {
        List<ApartmentEntity> apartments = apartmentRepository.findAvailableApartments();
        return apartments.stream()
                .map(apt -> ApartmentSimpleResponse.builder()
                        .apartmentId(apt.getApartmentId())
                        .roomNumber(apt.getRoomNumber())
                        .area(apt.getArea())
                        .floor(apt.getFloor())
                        .status(apt.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public HouseholdResponse createHousehold(HouseholdCreateRequest request) {
        // Validate apartment
        if (request.getApartment() == null || request.getApartment().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số phòng không được để trống");
        }

        // Validate members
        if (request.getMembers() == null || request.getMembers().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Phải có ít nhất 1 thành viên trong hộ khẩu");
        }

        // Tìm apartment theo room number
        Long roomNumber;
        try {
            roomNumber = Long.parseLong(request.getApartment());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số phòng không hợp lệ: " + request.getApartment());
        }

        ApartmentEntity apartment = apartmentRepository.findAll().stream()
                .filter(a -> a.getRoomNumber().equals(roomNumber))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy phòng số: " + roomNumber));

        // Kiểm tra apartment có available không (status = "1")
        if (!"1".equals(apartment.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Phòng " + roomNumber + " không còn trống");
        }

        // Tạo household mới
        HouseholdEntity household = new HouseholdEntity();
        household.setApartment(apartment);
        household.setStartDay(request.getStartDay());
        household.setStatus(request.getStatus() != null ? request.getStatus() : "1");

        // Tìm head of household (người có role = "Chủ hộ") và đếm số lượng
        Long headOfHouseholdId = null;
        int headCount = 0;
        for (var memberReq : request.getMembers()) {
            if ("Chủ hộ".equals(memberReq.getFamilyRole())) {
                headOfHouseholdId = memberReq.getResidentId();
                headCount++;
            }
        }

        if (headOfHouseholdId == null || headCount == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Phải có ít nhất 1 Chủ hộ");
        }

        if (headCount > 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Không thể có nhiều hơn 1 Chủ hộ");
        }

        household.setHeadOfHousehold(headOfHouseholdId);

        // Save household
        HouseholdEntity savedHousehold = houseHoldRepository.save(household);

        // Update residents với household_id và family_role
        for (var memberReq : request.getMembers()) {
            ResidentsEntity resident = residentRepository.findById(memberReq.getResidentId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Không tìm thấy cư dân với ID: " + memberReq.getResidentId()));

            resident.setHousehold(savedHousehold);
            resident.setFamilyRole(memberReq.getFamilyRole());
            residentRepository.save(resident);

            // Save history: THÊM_THÀNH_VIÊN (change_type = 1)
            saveResidenceHistory(resident.getResidentId(), savedHousehold.getHouseholdId(), 1L);
        }

        // Update apartment status = "0" (không còn trống)
        apartment.setStatus("0");
        apartmentRepository.save(apartment);

        // Reload household để lấy đầy đủ thông tin residents
        HouseholdEntity reloadedHousehold = houseHoldRepository.findById(savedHousehold.getHouseholdId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy hộ khẩu vừa tạo"));

        return householdMapper.toHouseholdResponse(reloadedHousehold);
    }

    @Override
    public HouseholdResponse updateHousehold(Long householdId, HouseholdUpdateRequest request) {
        // Tìm household
        HouseholdEntity household = houseHoldRepository.findById(householdId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy hộ khẩu với ID: " + householdId));

        boolean hasChanges = false;

        // Update apartment nếu có thay đổi
        if (request.getApartment() != null && !request.getApartment().trim().isEmpty()) {
            try {
                Long roomNumber = Long.parseLong(request.getApartment());
                // Tìm apartment theo room_number
                ApartmentEntity apartment = apartmentRepository.findAll().stream()
                        .filter(a -> a.getRoomNumber().equals(roomNumber))
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy phòng số: " + roomNumber));

                // Chỉ update nếu khác apartment hiện tại
                if (household.getApartment() == null ||
                        !household.getApartment().getApartmentId().equals(apartment.getApartmentId())) {
                    household.setApartment(apartment);
                    hasChanges = true;
                }
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Số phòng không hợp lệ: " + request.getApartment());
            }
        }

        // Update start_day nếu có thay đổi
        if (request.getStartDay() != null && !request.getStartDay().equals(household.getStartDay())) {
            household.setStartDay(request.getStartDay());
            hasChanges = true;
        }

        // Update status nếu có thay đổi (convert string to integer)
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            String newStatus = request.getStatus().trim();
            if (!newStatus.equals(household.getStatus())) {
                household.setStatus(newStatus);
                hasChanges = true;

                // Update apartment status based on household status
                if (household.getApartment() != null) {
                    ApartmentEntity apartment = household.getApartment();
                    // Nếu household status = "0" (Đã rời đi) → apartment status = "1" (Có phòng
                    // trống)
                    // Nếu household status = "1" (Đang ở) → apartment status = "0" (Không có phòng
                    // trống)
                    if ("0".equals(newStatus)) {
                        apartment.setStatus("1"); // Có phòng trống
                    } else if ("1".equals(newStatus)) {
                        apartment.setStatus("0"); // Không có phòng trống
                    }
                    apartmentRepository.save(apartment);
                }
            }
        }

        if (!hasChanges) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Không có thay đổi nào để cập nhật");
        }

        // Save và return
        HouseholdEntity savedHousehold = houseHoldRepository.save(household);
        return householdMapper.toHouseholdResponse(savedHousehold);
    }

    @Override
    public List<HouseholdResponse> getAllHouseholds() {
        List<HouseholdEntity> households = houseHoldRepository.findAll(
                Sort.by(Sort.Direction.DESC, "status")
                        .and(Sort.by(Sort.Direction.ASC, "householdId")));
        return householdMapper.toHouseholdResponses(households);
    }

    @Override
    public List<ResidenceHistoryResponse> getResidenceHistory(Long householdId) {
        List<ChangeHistoryEntity> histories = changeHistoryRepository.findByHouseholdId(householdId);

        return histories.stream()
                .map(history -> {
                    ResidentsEntity resident = history.getResident();
                    return ResidenceHistoryResponse.builder()
                            .residentId(resident.getResidentId())
                            .householdId(householdId)
                            .memberName(resident.getFullName())
                            .memberIdNumber(resident.getIdNumber())
                            .actionType(history.getChangeType() == 1L ? "THÊM_THÀNH_VIÊN" : "XÓA_THÀNH_VIÊN")
                            .actionDate(history.getDate())
                            .performedBy("Admin")
                            .note(history.getChangeType() == 1L ? "Thêm vào hộ khẩu" : "Rời khỏi hộ khẩu")
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<StayAbsenceRecordResponse> getStayAbsenceRecords(Long householdId) {
        List<StayAbsenceRecordEntity> records = stayAbsenceRecordRepository.findByHouseholdId(householdId);

        return records.stream()
                .map(record -> {
                    ResidentsEntity resident = record.getResident();
                    return StayAbsenceRecordResponse.builder()
                            .absenceId(record.getAbsenceId())
                            .residentId(resident.getResidentId())
                            .residentName(resident.getFullName())
                            .idNumber(resident.getIdNumber())
                            .recordType(record.getRecordType())
                            .start(record.getStart())
                            .end(record.getEnd())
                            .reason(record.getReason())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public StayAbsenceRecordResponse createStayAbsenceRecord(Long householdId, StayAbsenceRequest request) {
        // Validate resident exists and belongs to household
        ResidentsEntity resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy cư dân với ID: " + request.getResidentId()));

        if (resident.getHousehold() == null || !resident.getHousehold().getHouseholdId().equals(householdId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cư dân này không thuộc về hộ gia đình được chọn");
        }

        // Validate dates
        if (request.getEnd().isBefore(request.getStart()) || request.getEnd().isEqual(request.getStart())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ngày kết thúc phải sau ngày bắt đầu");
        }

        // Create new record
        StayAbsenceRecordEntity record = new StayAbsenceRecordEntity();
        record.setResident(resident);
        record.setRecordType(request.getRecordType());
        record.setStart(request.getStart());
        record.setEnd(request.getEnd());
        record.setReason(request.getReason());

        StayAbsenceRecordEntity savedRecord = stayAbsenceRecordRepository.save(record);

        return StayAbsenceRecordResponse.builder()
                .absenceId(savedRecord.getAbsenceId())
                .residentId(resident.getResidentId())
                .residentName(resident.getFullName())
                .idNumber(resident.getIdNumber())
                .recordType(savedRecord.getRecordType())
                .start(savedRecord.getStart())
                .end(savedRecord.getEnd())
                .reason(savedRecord.getReason())
                .build();
    }

    @Override
    public void deleteStayAbsenceRecord(Long absenceId) {
        if (!stayAbsenceRecordRepository.existsById(absenceId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy bản ghi với ID: " + absenceId);
        }
        stayAbsenceRecordRepository.deleteById(absenceId);
    }

    // Helper method to save residence history
    private void saveResidenceHistory(Long residentId, Long householdId, Long changeType) {
        ResidentsEntity resident = residentRepository.findById(residentId).orElse(null);
        HouseholdEntity household = houseHoldRepository.findById(householdId).orElse(null);

        if (resident != null && household != null) {
            ChangeHistoryEntity history = new ChangeHistoryEntity();
            // id is auto-generated
            history.setResident(resident);
            history.setHousehold(household);
            history.setChangeType(changeType);
            history.setDate(java.time.LocalDate.now());
            changeHistoryRepository.save(history);
        }
    }
}
