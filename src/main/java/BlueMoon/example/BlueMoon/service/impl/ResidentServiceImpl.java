package BlueMoon.example.BlueMoon.service.impl;

import BlueMoon.example.BlueMoon.dto.request.ResidentAddRequest;
import BlueMoon.example.BlueMoon.dto.request.ResidentSelectRequest;
import BlueMoon.example.BlueMoon.dto.response.ResidentResponse;
import BlueMoon.example.BlueMoon.dto.response.PageResponse;

import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import BlueMoon.example.BlueMoon.mapper.ResidentMapper;
import BlueMoon.example.BlueMoon.repository.resident.ChangeHistoryRepository;
import BlueMoon.example.BlueMoon.repository.resident.HouseHoldRepository;
import BlueMoon.example.BlueMoon.repository.resident.ResidentRepository;
import BlueMoon.example.BlueMoon.service.ResidentService;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;


@Service
public class ResidentServiceImpl implements ResidentService {

    @Autowired
    private  ResidentRepository residentRepository;
    @Autowired
    private ResidentMapper residentMapper;
    @Autowired
    private HouseHoldRepository householdRepository;
    @Autowired
    private ChangeHistoryRepository changeHistoryRepository;

    @Override
    public List<?> getAllJobs() {
        return residentRepository.findAllJobs();
    }


    @Override
    public PageResponse<ResidentResponse> searchResidents(ResidentSelectRequest request) {

        Specification<ResidentsEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (request.getSearchKeyword() != null && !request.getSearchKeyword().trim().isEmpty()) {
                String keyword = "%" + request.getSearchKeyword().toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("fullName")), keyword
                );
                Predicate phonePredicate = criteriaBuilder.like(
                    root.get("phoneNumber"), "%" + request.getSearchKeyword() + "%"
                );
                Predicate idNumberPredicate = criteriaBuilder.like(
                    root.get("idNumber"), "%" + request.getSearchKeyword() + "%"
                );
                predicates.add(criteriaBuilder.or(namePredicate, phonePredicate, idNumberPredicate));
            }

            if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender()));
            }

            if (request.getHasHousehold() != null) {
                if (request.getHasHousehold()) {
                    predicates.add(criteriaBuilder.isNotNull(root.get("household")));
                } else {
                    predicates.add(criteriaBuilder.isNull(root.get("household")));
                }
            }

            if (request.getFamilyRole() != null && !request.getFamilyRole().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("familyRole"), request.getFamilyRole()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        int page = Math.max(request.getPage() - 1, 0); 
        int pageSize = request.getPageSize() > 0 ? request.getPageSize() : 10;
        
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.ASC, "residentId"));
        Page<ResidentsEntity> pageResult = residentRepository.findAll(spec, pageable);
        
        List<ResidentResponse> responses = residentMapper.toResidentSelectResponses(pageResult.getContent());
        
        return PageResponse.<ResidentResponse>builder()
                .page(request.getPage()) // Return 1-based page
                .size(pageSize)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .data(responses)
                .build();
    }

    public ResidentResponse addResident(ResidentAddRequest request) {
    Long householdId = request.getHouseholdId();
    HouseholdEntity household = null; 

    if (householdId != null && householdId > 0) {
        household = householdRepository.findById(householdId).orElse(null);
    }

    ResidentsEntity entity = residentMapper.toResidentEntity(request);
    
    entity.setHousehold(household);
    
    ResidentsEntity savedEntity = residentRepository.save(entity);
    return residentMapper.toResidentSelectResponse(savedEntity);
}

    @Override
    @Transactional
    public Void deleteResident(ResidentResponse request) {
        Long id = request.getResidentId();

        int rows = changeHistoryRepository.deleteHistory(id);
        System.out.println("Deleted change_history rows = " + rows);

        residentRepository.deleteById(id);
        return null;
    }

    @Override
    public Void deleteResidentById(Long id) {
        return null;
    }

    @Override
    @Transactional
    public ResidentResponse updateResident(Long residentId, ResidentAddRequest request) {
        if (residentRepository.existsByPhoneNumberAndResidentIdNot(request.getPhoneNumber(), residentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại " + request.getPhoneNumber() + " đã được sử dụng bởi cư dân khác.");
        }
        if (residentRepository.existsByIdNumberAndResidentIdNot(request.getIdNumber(), residentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số CCCD " + request.getIdNumber() + " đã được sử dụng bởi cư dân khác.");
        }

        ResidentsEntity entity = residentRepository.findById(residentId)
                .orElseThrow(() -> new NoSuchElementException("Cư dân với id " + residentId + " không tồn tại."));

        if (("Head of Household".equalsIgnoreCase(entity.getFamilyRole()) || "Chủ hộ".equalsIgnoreCase(entity.getFamilyRole())) 
                && entity.getHousehold() != null) {
            Long currentHouseholdId = entity.getHousehold().getHouseholdId();
            Long newHouseholdId = request.getHouseholdId();
            
            if (newHouseholdId == null || !newHouseholdId.equals(currentHouseholdId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chủ hộ không được phép chuyển hộ khẩu. Vui lòng đổi vai trò thành viên trước.");
            }
        }

        String newRole = request.getFamilyRole();
        if ("Chủ hộ".equalsIgnoreCase(newRole)) newRole = "Head of Household";
        else if ("Vợ".equalsIgnoreCase(newRole)) newRole = "Wife";
        else if ("Chồng".equalsIgnoreCase(newRole)) newRole = "Husband";
        else if ("Con".equalsIgnoreCase(newRole)) newRole = "Child";
        else if ("Bố mẹ".equalsIgnoreCase(newRole)) newRole = "Parent";
        else if ("Thành viên khác".equalsIgnoreCase(newRole)) newRole = "Member";
        else if ("Khác".equalsIgnoreCase(newRole)) newRole = "Other";

        // Handle household change first
        Long newHouseholdId = request.getHouseholdId();
        HouseholdEntity newHousehold = null;
        
        if (newHouseholdId != null) {
             newHousehold = householdRepository.findById(newHouseholdId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Mã hộ gia đình " + newHouseholdId + " không tồn tại."
                ));
        }
        entity.setHousehold(newHousehold);
        
        // Now handle head of household change AFTER setting the household
        if ("Head of Household".equalsIgnoreCase(newRole) && entity.getHousehold() != null) {
             Long currentHouseholdId = entity.getHousehold().getHouseholdId();
             
             // Change old head to Member
             residentRepository.findByHousehold_HouseholdIdAndFamilyRole(currentHouseholdId, "Head of Household")
                 .ifPresent(currentHead -> {
                     if (!currentHead.getResidentId().equals(residentId)) {
                         currentHead.setFamilyRole("Member"); 
                         residentRepository.save(currentHead);
                     }
                 });
             
             // Update household.head_of_household to point to the new head
             HouseholdEntity household = entity.getHousehold();
             household.setHeadOfHousehold(residentId);
             householdRepository.save(household);
        }
        
        request.setFamilyRole(newRole);

        residentMapper.updateResidentFromRequest(request, entity);
        ResidentsEntity savedEntity = residentRepository.save(entity);
        return residentMapper.toResidentSelectResponse(savedEntity);
    }

}
