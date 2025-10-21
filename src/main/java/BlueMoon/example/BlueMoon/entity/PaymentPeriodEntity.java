package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "payment_period")
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPeriodEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_period_id")
    private Long paymentPeriodId;

    @Column(name = "count")
    private Long count;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_mandatory")
    private Boolean isMandatory;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "paymentPeriod", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FeesEntity> fees;

    @OneToMany(mappedBy = "paymentPeriod", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PayEntity> pays;
}
