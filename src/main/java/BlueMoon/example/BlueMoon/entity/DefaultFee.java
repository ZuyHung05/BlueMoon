package BlueMoon.example.BlueMoon.entity;

import BlueMoon.example.BlueMoon.enums.FeeType;
import BlueMoon.example.BlueMoon.enums.FeeTypeConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "default_fee")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DefaultFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Convert(converter = FeeTypeConverter.class)
    @Column(unique = true, nullable = false)
    private FeeType description;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;
}
