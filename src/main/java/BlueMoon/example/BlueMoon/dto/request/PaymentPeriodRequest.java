package BlueMoon.example.BlueMoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPeriodRequest {
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isMandatory;
}
