package BlueMoon.example.BlueMoon.repository.resident;

import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HouseHoldRepository extends JpaRepository<HouseholdEntity, Long>, JpaSpecificationExecutor<HouseholdEntity> {

}
