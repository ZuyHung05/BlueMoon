package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeDetailResponse {
    private Long feeId;
    private String description;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal quantity;
    private BigDecimal amount;
}
