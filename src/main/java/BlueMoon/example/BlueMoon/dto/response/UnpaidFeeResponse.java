package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnpaidFeeResponse {
    private Long paymentPeriodId;
    private String paymentPeriodName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal amount;
    private java.util.List<FeeDetailResponse> feeDetails;
}
