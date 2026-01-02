package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HouseholdRepository extends JpaRepository<HouseholdEntity, Long> {
    long countByStatus(String status);
}
