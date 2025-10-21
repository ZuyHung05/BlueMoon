package BlueMoon.example.BlueMoon.entity;

import BlueMoon.example.BlueMoon.serializable.PayId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pay")
@NoArgsConstructor
@AllArgsConstructor
public class PayEntity {

    @EmbeddedId
    private PayId id; // Khóa chính kết hợp

    @ManyToOne
    @MapsId("householdId") // ánh xạ với trường trong embedded id
    @JoinColumn(name = "household_id")
    private HouseholdEntity household;

    @ManyToOne
    @MapsId("paymentPeriodId")
    @JoinColumn(name = "payment_period_id")
    private PaymentPeriodEntity paymentPeriod;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "method")
    private String method;

    @Column(name = "pay_date")
    private LocalDateTime payDate;

}
