package BlueMoon.example.BlueMoon.repository.dashboard;

import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Repository
public class DashboardRepository {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Đếm tổng số hộ gia đình
     */
    public long countTotalHouseholds() {
        Query query = entityManager.createNativeQuery("SELECT COUNT(*) FROM household");
        return ((Number) query.getSingleResult()).longValue();
    }

    /**
     * Lấy tất cả stats cho Resident Dashboard với một query
     * Returns: [totalHouseholds, totalResidents, totalVehicles, motorcycleCount,
     * carCount]
     */
    public Object[] getResidentDashboardStats() {
        String sql = """
                SELECT
                    (SELECT COUNT(*) FROM household) as totalHouseholds,
                    (SELECT COUNT(*) FROM residents) as totalResidents,
                    (SELECT COUNT(*) FROM vehicle) as totalVehicles,
                    (SELECT COUNT(*) FROM vehicle WHERE LOWER(type) = 'bike') as motorcycleCount,
                    (SELECT COUNT(*) FROM vehicle WHERE LOWER(type) = 'car') as carCount
                """;

        Query query = entityManager.createNativeQuery(sql);
        return (Object[]) query.getSingleResult();
    }

    /**
     * Đếm records tạm trú/tạm vắng đang hiệu lực
     */
    public long countActiveStayRecords(String recordType, LocalDateTime currentTime) {
        String sql = """
                SELECT COUNT(*) FROM stay_absence_record
                WHERE record_type = :recordType
                AND start <= :currentTime
                AND "end" >= :currentTime
                """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("recordType", recordType);
        query.setParameter("currentTime", currentTime);

        return ((Number) query.getSingleResult()).longValue();
    }

    /**
     * Lấy cơ cấu hộ gia đình (cá nhân, gia đình nhỏ, gia đình lớn)
     */
    public Map<String, Long> getHouseholdComposition() {
        String sql = """
                SELECT
                    CASE
                        WHEN member_count = 1 THEN 'Cá nhân'
                        WHEN member_count <= 2 THEN 'Gia đình nhỏ'
                        ELSE 'Gia đình lớn'
                    END as category,
                    COUNT(*) as count
                FROM (
                    SELECT h.household_id, COUNT(r.resident_id) as member_count
                    FROM household h
                    LEFT JOIN residents r ON h.household_id = r.household_id
                    GROUP BY h.household_id
                ) as household_members
                GROUP BY category
                """;

        Query query = entityManager.createNativeQuery(sql);

        Map<String, Long> composition = new HashMap<>();
        for (Object row : query.getResultList()) {
            Object[] cols = (Object[]) row;
            String category = (String) cols[0];
            Long count = ((Number) cols[1]).longValue();
            if (category != null) {
                composition.put(category, count);
            }
        }

        return composition;
    }
}
