package BlueMoon.example.BlueMoon.repository.resident;

import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResidentRepository extends JpaRepository<ResidentsEntity, Long>, JpaSpecificationExecutor<ResidentsEntity> {
    @Query("SELECT DISTINCT r.job FROM ResidentsEntity r WHERE r.job IS NOT NULL AND r.job != ''")
    List<String> findAllJobs();

    Optional<ResidentsEntity> findByIdNumber(String idNumber);

    boolean existsByPhoneNumberAndResidentIdNot(String phoneNumber, Long residentId);
    boolean existsByIdNumberAndResidentIdNot(String idNumber, Long residentId);
    
    // Tìm chủ hộ của một hộ gia đình
    Optional<ResidentsEntity> findByHousehold_HouseholdIdAndFamilyRole(Long householdId, String familyRole);
}
