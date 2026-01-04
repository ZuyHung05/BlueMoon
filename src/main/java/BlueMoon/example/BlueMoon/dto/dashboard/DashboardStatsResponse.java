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
        // KPI metrics (amount in VND)
        private Double totalAmount; // Tổng tiền phải thu
        private Double paidAmount; // Tiền đã thu
        private Double unpaidAmount; // Tiền còn nợ
        private Double collectionRate; // Tỷ lệ thu (%)
        private Double paidAmountChange; // % thay đổi tiền đã thu
        private Double unpaidAmountChange; // % thay đổi tiền còn nợ

        // Legacy fields (for backward compatibility)
        private Long totalHouseholds;
        private Long paidHouseholds;
        private Long overdueHouseholdCount;
        private Long unpaidHouseholds;

        // Charts and tables data
        private List<CategoryFee> feesByCategory;
        private List<CategoryFee> feesByPaymentMethod;
        private List<CategoryFee> topPaymentPeriods;
        private List<MonthlyRevenue> revenueOverTime;
        private PaymentStatus paymentStatus;
        private List<OverdueHousehold> overdueHouseholds; // Hộ quá hạn nghiêm trọng
        private List<BadDebtTrend> badDebtTrend; // Xu hướng nợ xấu
        private List<RecentPayment> recentPayments; // Hoạt động gần đây
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
        private List<ApartmentComposition> apartmentComposition; // For frontend chart
        private List<VehicleTypeStats> vehicleTypeDistribution;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApartmentComposition {
        private String label; // Gia đình nhỏ, Gia đình lớn, Cá nhân
        private Integer percent; // Phần trăm
        private String color; // Màu sắc
        private String hint; // Gợi ý (1-3 người/căn)
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

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverdueHousehold {
        private String id; // Household ID hoặc apartment code
        private String name; // Tên hộ (household name)
        private String householdName; // Alternative field name
        private Double amount; // Số tiền nợ
        private Integer days; // Số ngày quá hạn
        private Integer overdueDays; // Alternative field name
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadDebtTrend {
        private String month; // Tháng
        private Double value; // Giá trị nợ (triệu đồng)
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentPayment {
        private String household; // Tên/mã hộ
        private String householdName; // Alternative field name
        private String fee; // Loại phí
        private String feeType; // Alternative field name
        private Double amount; // Số tiền
        private String status; // Trạng thái (Đã thanh toán, Chưa thanh toán, Trễ hạn)
        private String date; // Ngày
        private String paymentDate; // Alternative field name
    }
}
