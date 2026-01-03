package BlueMoon.example.BlueMoon.service.dashboard;

import BlueMoon.example.BlueMoon.dto.dashboard.DashboardStatsResponse;
import BlueMoon.example.BlueMoon.repository.dashboard.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    /**
     * Lấy thống kê cho Fee Dashboard - Tối ưu với native queries
     */
    @Cacheable(value = "feeStats", key = "'fee-dashboard'")
    public DashboardStatsResponse.FeeStats getFeeStats() {
        // Get basic counts với một query
        long totalHouseholds = dashboardRepository.countTotalHouseholds();

        // Calculate payment stats (mock percentages for now)
        long paidHouseholds = (long) (totalHouseholds * 0.65);
        long unpaidHouseholds = (long) (totalHouseholds * 0.25);
        long overdueHouseholds = totalHouseholds - paidHouseholds - unpaidHouseholds;

        // Fee categories
        List<DashboardStatsResponse.CategoryFee> feesByCategory = Arrays.asList(
                new DashboardStatsResponse.CategoryFee("Phí quản lý", 45000000.0, "#3b82f6"),
                new DashboardStatsResponse.CategoryFee("Phí dịch vụ", 32000000.0, "#22c55e"),
                new DashboardStatsResponse.CategoryFee("Phí gửi xe", 28000000.0, "#f59e0b"),
                new DashboardStatsResponse.CategoryFee("Khác", 15000000.0, "#ef4444"));

        // Monthly revenue
        List<DashboardStatsResponse.MonthlyRevenue> revenueOverTime = generateMonthlyRevenue();

        DashboardStatsResponse.PaymentStatus paymentStatus = new DashboardStatsResponse.PaymentStatus(paidHouseholds,
                unpaidHouseholds, overdueHouseholds);

        DashboardStatsResponse.FeeStats feeStats = new DashboardStatsResponse.FeeStats();
        feeStats.setTotalHouseholds(totalHouseholds);
        feeStats.setPaidHouseholds(paidHouseholds);
        feeStats.setOverdueHouseholds(overdueHouseholds);
        feeStats.setUnpaidHouseholds(unpaidHouseholds);
        feeStats.setFeesByCategory(feesByCategory);
        feeStats.setRevenueOverTime(revenueOverTime);
        feeStats.setPaymentStatus(paymentStatus);

        return feeStats;
    }

    /**
     * Lấy thống kê cho Resident Dashboard - Tối ưu với native queries
     */
    @Cacheable(value = "residentStats", key = "'resident-dashboard'")
    public DashboardStatsResponse.ResidentStats getResidentStats() {
        // Lấy tất cả counts với một batch query
        Object[] stats = dashboardRepository.getResidentDashboardStats();

        long totalHouseholds = ((Number) stats[0]).longValue();
        long totalResidents = ((Number) stats[1]).longValue();
        long totalVehicles = ((Number) stats[2]).longValue();
        long motorcycleCount = ((Number) stats[3]).longValue();
        long carCount = ((Number) stats[4]).longValue();

        // Parking stats
        long totalParkingSpots = 93L;
        double parkingUsagePercent = totalParkingSpots > 0
                ? Math.round((double) totalVehicles / totalParkingSpots * 1000.0) / 10.0
                : 0.0;

        // Temporary residence stats
        LocalDateTime now = LocalDateTime.now();
        long temporaryStayCount = dashboardRepository.countActiveStayRecords("temporary_stay", now);
        long temporaryAbsenceCount = dashboardRepository.countActiveStayRecords("temporary_absence", now);

        // Vehicle type distribution
        List<DashboardStatsResponse.VehicleTypeStats> vehicleTypeDistribution = new ArrayList<>();
        if (totalVehicles > 0) {
            vehicleTypeDistribution.add(new DashboardStatsResponse.VehicleTypeStats(
                    "Xe máy", motorcycleCount,
                    Math.round((double) motorcycleCount / totalVehicles * 1000.0) / 10.0,
                    "#3b82f6"));
            vehicleTypeDistribution.add(new DashboardStatsResponse.VehicleTypeStats(
                    "Ô tô", carCount,
                    Math.round((double) carCount / totalVehicles * 1000.0) / 10.0,
                    "#22c55e"));
        }

        // Household composition
        Map<String, Long> householdComposition = dashboardRepository.getHouseholdComposition();

        DashboardStatsResponse.ResidentStats residentStats = new DashboardStatsResponse.ResidentStats();
        residentStats.setTotalResidents(totalResidents);
        residentStats.setTotalHouseholds(totalHouseholds);
        residentStats.setTotalVehicles(totalVehicles);
        residentStats.setTotalParkingSpots(totalParkingSpots);
        residentStats.setUsedParkingSpots(totalVehicles);
        residentStats.setParkingUsagePercent(parkingUsagePercent);
        residentStats.setTemporaryStayCount(temporaryStayCount);
        residentStats.setTemporaryAbsenceCount(temporaryAbsenceCount);
        residentStats.setVehicleTypeDistribution(vehicleTypeDistribution);
        residentStats.setHouseholdComposition(householdComposition);

        return residentStats;
    }

    private List<DashboardStatsResponse.MonthlyRevenue> generateMonthlyRevenue() {
        String[] months = { "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12" };
        Double[] amounts = { 95000000.0, 98000000.0, 102000000.0, 105000000.0, 108000000.0, 120000000.0 };

        List<DashboardStatsResponse.MonthlyRevenue> revenue = new ArrayList<>();
        for (int i = 0; i < months.length; i++) {
            revenue.add(new DashboardStatsResponse.MonthlyRevenue(months[i], amounts[i]));
        }
        return revenue;
    }
}
