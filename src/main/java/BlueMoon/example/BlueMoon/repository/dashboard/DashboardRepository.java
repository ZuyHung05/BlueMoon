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
    @SuppressWarnings("unchecked")
    public Map<String, Long> getHouseholdComposition() {
        String sql = """
                SELECT
                    CASE
                        WHEN member_count = 1 THEN 'Cá nhân'
                        WHEN member_count <= 3 THEN 'Gia đình nhỏ'
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

    /**
     * Lấy thống kê tổng hợp cho Fee Dashboard
     * Returns: [totalAmount, paidAmount, unpaidAmount]
     */
    public Object[] getFeeDashboardStats() {
        String sql = """
                SELECT
                    COALESCE(SUM(p.amount), 0) as totalAmount,
                    COALESCE(SUM(CASE WHEN p.pay_date IS NOT NULL THEN p.amount ELSE 0 END), 0) as paidAmount,
                    COALESCE(SUM(CASE WHEN p.pay_date IS NULL THEN p.amount ELSE 0 END), 0) as unpaidAmount
                FROM pay p
                """;

        Query query = entityManager.createNativeQuery(sql);
        return (Object[]) query.getSingleResult();
    }

    /**
     * Lấy danh sách hộ quá hạn nghiêm trọng (top 5)
     * Returns: List of [householdId, roomNumber, totalDebt, overdueDays]
     */
    @SuppressWarnings("unchecked")
    public java.util.List<Object[]> getOverdueHouseholds(int limit) {
        String sql = """
                SELECT
                    h.household_id,
                    a.room_number,
                    COALESCE(SUM(p.amount), 0) as total_debt,
                    COALESCE(MAX(CURRENT_DATE - pp.end_date::date), 0) as overdue_days
                FROM household h
                JOIN apartment a ON h.apartment_id = a.apartment_id
                LEFT JOIN pay p ON h.household_id = p.household_id
                LEFT JOIN payment_period pp ON p.payment_period_id = pp.payment_period_id
                WHERE (p.pay_date IS NULL OR p.pay_date::date > pp.end_date::date)
                    AND pp.end_date::date < CURRENT_DATE
                GROUP BY h.household_id, a.room_number
                HAVING COALESCE(SUM(p.amount), 0) > 0
                ORDER BY overdue_days DESC, total_debt DESC
                LIMIT :limit
                """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("limit", limit);
        return query.getResultList();
    }

    /**
     * Lấy xu hướng nợ xấu 6 tháng gần nhất
     * Returns: List of [month, totalDebt]
     */
    @SuppressWarnings("unchecked")
    public java.util.List<Object[]> getBadDebtTrend(int months) {
        String sql = """
                WITH RECURSIVE month_series AS (
                    SELECT CURRENT_DATE - INTERVAL '5 months' as month_date
                    UNION ALL
                    SELECT month_date + INTERVAL '1 month'
                    FROM month_series
                    WHERE month_date < CURRENT_DATE
                )
                SELECT
                    TO_CHAR(ms.month_date, 'Mon') as month_name,
                    COALESCE(SUM(p.amount), 0) / 1000000.0 as debt_millions
                FROM month_series ms
                LEFT JOIN payment_period pp ON DATE_TRUNC('month', pp.end_date::date) = DATE_TRUNC('month', ms.month_date)
                LEFT JOIN pay p ON pp.payment_period_id = p.payment_period_id
                WHERE pp.end_date::date < CURRENT_DATE
                    AND (p.pay_date IS NULL OR p.pay_date::date > pp.end_date::date)
                GROUP BY ms.month_date, month_name
                ORDER BY ms.month_date
                """;

        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }

    /**
     * Lấy hoạt động thanh toán gần đây (top 10)
     * Returns: List of [roomNumber, description, amount, status, paymentDate]
     */
    @SuppressWarnings("unchecked")
    public java.util.List<Object[]> getRecentPayments(int limit) {
        String sql = """
                SELECT
                    a.room_number,
                    COALESCE(pp.description, 'Phí quản lý') as fee_description,
                    p.amount,
                    CASE
                        WHEN p.pay_date IS NOT NULL THEN 'Đã thanh toán'
                        WHEN pp.end_date::date < CURRENT_DATE THEN 'Trễ hạn'
                        ELSE 'Chưa thanh toán'
                    END as status,
                    COALESCE(p.pay_date, pp.end_date::date) as payment_date
                FROM pay p
                JOIN household h ON p.household_id = h.household_id
                JOIN apartment a ON h.apartment_id = a.apartment_id
                JOIN payment_period pp ON p.payment_period_id = pp.payment_period_id
                ORDER BY COALESCE(p.pay_date, pp.end_date::date) DESC
                LIMIT :limit
                """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("limit", limit);
        return query.getResultList();
    }

    /**
     * Lấy tổng thu theo loại phí (từ payment_period.description)
     * Returns: List of [description, totalAmount]
     */
    @SuppressWarnings("unchecked")
    public java.util.List<Object[]> getRevenueByCategory(int limit) {
        String sql = """
                SELECT
                    pp.description,
                    COALESCE(SUM(p.amount), 0) as total_amount
                FROM pay p
                JOIN payment_period pp ON p.payment_period_id = pp.payment_period_id
                WHERE p.pay_date IS NOT NULL
                GROUP BY pp.description
                ORDER BY total_amount DESC
                LIMIT :limit
                """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("limit", limit);
        return query.getResultList();
    }

    /**
     * Lấy doanh thu 12 tháng gần nhất (rolling)
     * Returns: List of [monthLabel, year, revenue]
     * Ví dụ: Nếu đang ở tháng 1/2026, trả về từ tháng 2/2025 đến tháng 1/2026
     */
    @SuppressWarnings("unchecked")
    public java.util.List<Object[]> getMonthlyRevenue(int months) {
        String sql = """
                WITH month_series AS (
                    SELECT generate_series(
                        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '%d months',
                        DATE_TRUNC('month', CURRENT_DATE),
                        '1 month'::interval
                    )::date as month_date
                )
                SELECT
                    'Tháng ' || EXTRACT(MONTH FROM ms.month_date)::int as month_label,
                    EXTRACT(YEAR FROM ms.month_date)::int as year,
                    COALESCE(SUM(p.amount), 0) as revenue
                FROM month_series ms
                LEFT JOIN pay p ON DATE_TRUNC('month', p.pay_date) = DATE_TRUNC('month', ms.month_date)
                    AND p.pay_date IS NOT NULL
                GROUP BY ms.month_date
                ORDER BY ms.month_date
                """.formatted(months - 1);

        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }
}
