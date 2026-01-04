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

                // Get fee dashboard stats (totalAmount, paidAmount, unpaidAmount)
                Object[] feeStats = dashboardRepository.getFeeDashboardStats();
                Double totalAmount = ((Number) feeStats[0]).doubleValue();
                Double paidAmount = ((Number) feeStats[1]).doubleValue();
                Double unpaidAmount = ((Number) feeStats[2]).doubleValue();

                // Calculate collection rate
                Double collectionRate = totalAmount > 0 ? (paidAmount / totalAmount * 100.0) : 0.0;
                collectionRate = Math.round(collectionRate * 10.0) / 10.0;

                // Mock change percentages (would need historical data to calculate real values)
                Double paidAmountChange = 4.2;
                Double unpaidAmountChange = 2.1;

                // Get household payment statistics from database
                Object[] householdStats = dashboardRepository.getHouseholdPaymentStats();
                long paidHouseholds = ((Number) householdStats[0]).longValue();
                long unpaidHouseholds = ((Number) householdStats[1]).longValue();
                long overdueHouseholds = ((Number) householdStats[2]).longValue();

                // Get overdue households (top 5)
                List<DashboardStatsResponse.OverdueHousehold> overdueHouseholdsList = new ArrayList<>();
                List<Object[]> overdueData = dashboardRepository.getOverdueHouseholds(5);
                for (Object[] row : overdueData) {
                        String roomNumber = row[1] != null ? String.valueOf(row[1]) : "N/A";
                        DashboardStatsResponse.OverdueHousehold household = DashboardStatsResponse.OverdueHousehold
                                        .builder()
                                        .id(String.valueOf(row[0]))
                                        .name("Hộ " + roomNumber)
                                        .householdName("Hộ " + roomNumber)
                                        .amount(((Number) row[2]).doubleValue())
                                        .days(((Number) row[3]).intValue())
                                        .overdueDays(((Number) row[3]).intValue())
                                        .build();
                        overdueHouseholdsList.add(household);
                }

                // Get bad debt trend (6 months)
                List<DashboardStatsResponse.BadDebtTrend> badDebtTrend = new ArrayList<>();
                List<Object[]> trendData = dashboardRepository.getBadDebtTrend(6);
                for (Object[] row : trendData) {
                        DashboardStatsResponse.BadDebtTrend trend = DashboardStatsResponse.BadDebtTrend.builder()
                                        .month((String) row[0])
                                        .value(((Number) row[1]).doubleValue())
                                        .build();
                        badDebtTrend.add(trend);
                }

                // Get recent payments (top 10)
                List<DashboardStatsResponse.RecentPayment> recentPayments = new ArrayList<>();
                List<Object[]> paymentData = dashboardRepository.getRecentPayments(10);
                for (Object[] row : paymentData) {
                        String roomNumber = row[0] != null ? String.valueOf(row[0]) : "N/A";
                        String feeDescription = row[1] != null ? (String) row[1] : "Phí quản lý";
                        String status = row[3] != null ? (String) row[3] : "Chưa thanh toán";

                        DashboardStatsResponse.RecentPayment payment = DashboardStatsResponse.RecentPayment.builder()
                                        .household(roomNumber)
                                        .householdName(roomNumber)
                                        .fee(feeDescription)
                                        .feeType(feeDescription)
                                        .amount(((Number) row[2]).doubleValue())
                                        .status(status)
                                        .date(row[4] != null ? row[4].toString() : "")
                                        .paymentDate(row[4] != null ? row[4].toString() : "")
                                        .build();
                        recentPayments.add(payment);
                }

                // Fee statistics - Updated mapping:
                // - feesByCategory (pie chart left): Payment method
                // - topPaymentPeriods (bar chart right): All fee types
                List<DashboardStatsResponse.CategoryFee> feesByMandatoryType = fetchFeesByMandatoryType();
                List<DashboardStatsResponse.CategoryFee> feesByPaymentMethod = fetchFeesByPaymentMethod();
                List<DashboardStatsResponse.CategoryFee> topPaymentPeriods = fetchAllFeeTypeRevenue();

                // Monthly revenue
                List<DashboardStatsResponse.MonthlyRevenue> revenueOverTime = generateMonthlyRevenue();

                DashboardStatsResponse.PaymentStatus paymentStatus = new DashboardStatsResponse.PaymentStatus(
                                paidHouseholds, unpaidHouseholds, overdueHouseholds);

                return DashboardStatsResponse.FeeStats.builder()
                                .totalAmount(totalAmount)
                                .paidAmount(paidAmount)
                                .unpaidAmount(unpaidAmount)
                                .collectionRate(collectionRate)
                                .paidAmountChange(paidAmountChange)
                                .unpaidAmountChange(unpaidAmountChange)
                                .totalHouseholds(totalHouseholds)
                                .paidHouseholds(paidHouseholds)
                                .overdueHouseholdCount(overdueHouseholds)
                                .unpaidHouseholds(unpaidHouseholds)
                                .overdueHouseholds(overdueHouseholdsList)
                                .badDebtTrend(badDebtTrend)
                                .recentPayments(recentPayments)
                                .feesByCategory(feesByPaymentMethod)
                                .feesByPaymentMethod(feesByMandatoryType)
                                .topPaymentPeriods(topPaymentPeriods)
                                .revenueOverTime(revenueOverTime)
                                .paymentStatus(paymentStatus)
                                .build();
        }

        /**
         * Lấy thống kê cho Resident Dashboard - Tối ưu với native queries
         */
        // @Cacheable(value = "residentStats", key = "'resident-dashboard'") // Tạm thời
        // disable cache để test
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
                long temporaryStayCount = dashboardRepository.countActiveStayRecords("temporary_residence", now);
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

                // Household composition (raw data)
                Map<String, Long> householdComposition = dashboardRepository.getHouseholdComposition();

                // Convert to apartment composition for frontend chart
                List<DashboardStatsResponse.ApartmentComposition> apartmentComposition = new ArrayList<>();
                if (totalHouseholds > 0) {
                        long smallFamily = householdComposition.getOrDefault("Gia đình nhỏ", 0L);
                        long largeFamily = householdComposition.getOrDefault("Gia đình lớn", 0L);
                        long individual = householdComposition.getOrDefault("Cá nhân", 0L);

                        int smallPercent = (int) Math.round((double) smallFamily / totalHouseholds * 100);
                        int largePercent = (int) Math.round((double) largeFamily / totalHouseholds * 100);
                        int individualPercent = (int) Math.round((double) individual / totalHouseholds * 100);

                        apartmentComposition.add(DashboardStatsResponse.ApartmentComposition.builder()
                                        .label("Gia đình nhỏ")
                                        .percent(smallPercent)
                                        .color("#3b82f6")
                                        .hint("1–3 người / căn")
                                        .build());

                        apartmentComposition.add(DashboardStatsResponse.ApartmentComposition.builder()
                                        .label("Gia đình lớn")
                                        .percent(largePercent)
                                        .color("#22c55e")
                                        .hint(">4 người / căn")
                                        .build());

                        apartmentComposition.add(DashboardStatsResponse.ApartmentComposition.builder()
                                        .label("Cá nhân")
                                        .percent(individualPercent)
                                        .color("#f59e0b")
                                        .hint("1 người / căn")
                                        .build());
                }

                return DashboardStatsResponse.ResidentStats.builder()
                                .totalResidents(totalResidents)
                                .totalHouseholds(totalHouseholds)
                                .totalVehicles(totalVehicles)
                                .totalParkingSpots(totalParkingSpots)
                                .usedParkingSpots(totalVehicles)
                                .parkingUsagePercent(parkingUsagePercent)
                                .temporaryStayCount(temporaryStayCount)
                                .temporaryAbsenceCount(temporaryAbsenceCount)
                                .householdComposition(householdComposition)
                                .apartmentComposition(apartmentComposition)
                                .vehicleTypeDistribution(vehicleTypeDistribution)
                                .build();
        }

        /**
         * Lấy doanh thu 12 tháng gần nhất từ database
         */
        private List<DashboardStatsResponse.MonthlyRevenue> generateMonthlyRevenue() {
                List<DashboardStatsResponse.MonthlyRevenue> revenue = new ArrayList<>();
                List<Object[]> data = dashboardRepository.getMonthlyRevenue(12);

                for (Object[] row : data) {
                        String monthLabel = (String) row[0];
                        Double amount = ((Number) row[2]).doubleValue();
                        revenue.add(new DashboardStatsResponse.MonthlyRevenue(monthLabel, amount));
                }

                return revenue;
        }

        /**
         * Lấy tổng thu theo loại phí từ database
         */
        private List<DashboardStatsResponse.CategoryFee> fetchRevenueByCategory() {
                String[] colors = { "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444" };
                List<DashboardStatsResponse.CategoryFee> categories = new ArrayList<>();
                List<Object[]> data = dashboardRepository.getRevenueByCategory(5);

                for (int i = 0; i < data.size(); i++) {
                        Object[] row = data.get(i);
                        String description = (String) row[0];
                        Double amount = ((Number) row[1]).doubleValue();
                        String color = colors[i % colors.length];
                        categories.add(new DashboardStatsResponse.CategoryFee(description, amount, color));
                }

                return categories;
        }

        private List<DashboardStatsResponse.CategoryFee> fetchFeesByMandatoryType() {
                String[] colors = { "#3b82f6", "#f59e0b" };
                List<DashboardStatsResponse.CategoryFee> categories = new ArrayList<>();
                List<Object[]> data = dashboardRepository.getFeeByMandatoryType();
                for (int i = 0; i < data.size(); i++) {
                        Object[] row = data.get(i);
                        categories.add(new DashboardStatsResponse.CategoryFee((String) row[0],
                                        ((Number) row[1]).doubleValue(), colors[i % colors.length]));
                }
                return categories;
        }

        private List<DashboardStatsResponse.CategoryFee> fetchFeesByPaymentMethod() {
                String[] colors = { "#22c55e", "#8b5cf6", "#ef4444" };
                List<DashboardStatsResponse.CategoryFee> categories = new ArrayList<>();
                List<Object[]> data = dashboardRepository.getFeeByPaymentMethod();
                for (int i = 0; i < data.size(); i++) {
                        Object[] row = data.get(i);
                        categories.add(new DashboardStatsResponse.CategoryFee((String) row[0],
                                        ((Number) row[1]).doubleValue(), colors[i % colors.length]));
                }
                return categories;
        }

        private List<DashboardStatsResponse.CategoryFee> fetchTopPaymentPeriods() {
                String[] colors = { "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444" };
                List<DashboardStatsResponse.CategoryFee> categories = new ArrayList<>();
                List<Object[]> data = dashboardRepository.getTopPaymentPeriods(5);
                for (int i = 0; i < data.size(); i++) {
                        Object[] row = data.get(i);
                        categories.add(new DashboardStatsResponse.CategoryFee((String) row[0],
                                        ((Number) row[1]).doubleValue(), colors[i % colors.length]));
                }
                return categories;
        }

        private List<DashboardStatsResponse.CategoryFee> fetchAllFeeTypeRevenue() {
                String[] colors = { "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#06b6d4",
                                "#f97316" };
                List<DashboardStatsResponse.CategoryFee> categories = new ArrayList<>();
                List<Object[]> data = dashboardRepository.getAllFeeTypeRevenue();
                for (int i = 0; i < data.size(); i++) {
                        Object[] row = data.get(i);
                        categories.add(new DashboardStatsResponse.CategoryFee((String) row[0],
                                        ((Number) row[1]).doubleValue(), colors[i % colors.length]));
                }
                return categories;
        }
}
