package BlueMoon.example.BlueMoon.repository.resident;

import BlueMoon.example.BlueMoon.entity.StayAbsenceRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StayAbsenceRecordRepository extends JpaRepository<StayAbsenceRecordEntity, Long> {

    /**
     * Đếm số lượng records đang hiệu lực theo loại (tạm trú/tạm vắng)
     * 
     * @param recordType  "temporary_stay" hoặc "temporary_absence"
     * @param currentTime thời điểm hiện tại
     * @return số lượng records
     */
    @Query("SELECT COUNT(s) FROM StayAbsenceRecordEntity s " +
            "WHERE s.recordType = :recordType " +
            "AND s.start <= :currentTime " +
            "AND s.end >= :currentTime")
    long countActiveRecordsByType(@Param("recordType") String recordType,
            @Param("currentTime") LocalDateTime currentTime);
}
