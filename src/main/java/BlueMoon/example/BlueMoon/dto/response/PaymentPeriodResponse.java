package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPeriodResponse {
    private Long paymentPeriodId;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isMandatory;
    private Long count; // Number of paid households
    private Long total; // Total households
    private java.math.BigDecimal collectedAmount;
}
