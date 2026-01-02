package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "default_fee")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DefaultFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;
}
