package BlueMoon.example.BlueMoon.serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PayId implements Serializable {
    @Column(name = "household_id")
    private Long householdId;
    @Column(name = "payment_period_id")
    private Long paymentPeriodId;
}
