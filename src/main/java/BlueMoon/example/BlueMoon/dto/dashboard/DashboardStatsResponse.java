package BlueMoon.example.BlueMoon.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeeStats {
        private Long totalHouseholds;
        private Long paidHouseholds;
        private Long overdueHouseholds;
        private Long unpaidHouseholds;
        private List<CategoryFee> feesByCategory;
        private List<MonthlyRevenue> revenueOverTime;
        private PaymentStatus paymentStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResidentStats {
        private Long totalResidents;
        private Long totalHouseholds;
        private Long totalVehicles;
        private Long totalParkingSpots;
        private Long usedParkingSpots;
        private Double parkingUsagePercent;
        private Long temporaryStayCount;
        private Long temporaryAbsenceCount;
        private Map<String, Long> householdComposition;
        private List<VehicleTypeStats> vehicleTypeDistribution;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryFee {
        private String category;
        private Double amount;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private Double amount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentStatus {
        private Long paid;
        private Long unpaid;
        private Long overdue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleTypeStats {
        private String type;
        private Long count;
        private Double percent;
        private String color;
    }
}
