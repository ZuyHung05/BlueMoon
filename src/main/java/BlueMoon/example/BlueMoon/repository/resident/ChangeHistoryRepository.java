package BlueMoon.example.BlueMoon.repository.resident;

import BlueMoon.example.BlueMoon.entity.ChangeHistoryEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChangeHistoryRepository extends JpaRepository<ChangeHistoryEntity, Long> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM change_history WHERE resident_id = :residentId", nativeQuery = true)
    int deleteHistory(@Param("residentId") Long residentId);

}
