package BlueMoon.example.BlueMoon.service.resident.Impl;

import BlueMoon.example.BlueMoon.dto.request.ResidentAddRequest;
import BlueMoon.example.BlueMoon.dto.request.ResidentSelectRequest;
import BlueMoon.example.BlueMoon.dto.response.ResidentResponse;
import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import BlueMoon.example.BlueMoon.mapper.ResidentMapper;
import BlueMoon.example.BlueMoon.repository.resident.ChangeHistoryRepository;
import BlueMoon.example.BlueMoon.repository.resident.HouseHoldRepository;
import BlueMoon.example.BlueMoon.repository.resident.ResidentRepository;
import BlueMoon.example.BlueMoon.service.resident.ResidentService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<ResidentResponse> searchResidents(ResidentSelectRequest request) {

        Specification<ResidentsEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("fullName")),
                        "%" + request.getFullName().toLowerCase() + "%"
                ));
            }

            if (request.getJob() != null && !request.getJob().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("job"), request.getJob()));
            }

            if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("phoneNumber"), "%" + request.getPhoneNumber() + "%"));
            }

            if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender()));
            }

            if (request.getHouseholdId() != null) {
                Join<ResidentsEntity, HouseholdEntity> householdJoin = root.join("household");
                predicates.add(criteriaBuilder.equal(householdJoin.get("householdId"), request.getHouseholdId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        List<ResidentsEntity> entities = residentRepository.findAll(spec);
        return residentMapper.toResidentSelectResponses(entities);
    }

    public ResidentResponse addResident(ResidentAddRequest request) {
        Long householdId = request.getHouseholdId();
        HouseholdEntity household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Mã hộ gia đình " + householdId + " không tồn tại."
                ));
        ResidentsEntity entity = residentMapper.toResidentEntity(request);
        entity.setHousehold(household);
        ResidentsEntity savedEntity = residentRepository.save(entity);
        return residentMapper.toResidentSelectResponse(savedEntity);
    }

    @Override
    @Transactional
    public Void deleteResident(ResidentResponse request) {
        Long id = request.getResidentId();

        // 1. Xóa change_history trước
        int rows = changeHistoryRepository.deleteHistory(id);
        System.out.println("Deleted change_history rows = " + rows);

        // 2. Sau đó mới xóa resident
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
        ResidentsEntity entity = residentRepository.findById(residentId)
                .orElseThrow(() -> new NoSuchElementException("Cư dân với id " + residentId + " không tồn tại."));
        residentMapper.updateResidentFromRequest(request, entity);
        ResidentsEntity savedEntity = residentRepository.save(entity);
        return residentMapper.toResidentSelectResponse(savedEntity);
    }

}
