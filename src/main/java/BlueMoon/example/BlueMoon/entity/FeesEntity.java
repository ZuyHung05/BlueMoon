package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "fees")
@NoArgsConstructor
@AllArgsConstructor
public class FeesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fees_id")
    private Long feesId;

    // Quan hệ với bảng household
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private HouseholdEntity household;

    // Quan hệ với bảng payment_period
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_period_id")
    private PaymentPeriodEntity paymentPeriod;

    @Column(name = "unit")
    private String unit;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "description")
    private String description;
}
