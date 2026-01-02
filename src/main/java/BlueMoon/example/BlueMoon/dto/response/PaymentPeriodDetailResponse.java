package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPeriodDetailResponse {
    private Long householdId;
    private String householdName;
    private String room;
    private BigDecimal requiredAmount;
    private BigDecimal paidAmount;
    private String status; // "Paid" or "Unpaid"
    private LocalDateTime paidDate;
    private String method;
    private java.util.List<FeeDetailResponse> feeDetails;
}
