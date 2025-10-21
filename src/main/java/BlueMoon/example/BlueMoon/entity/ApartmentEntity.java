package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@Table(name = "apartment")
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apartment_id")
    private Long apartmentId;

    @Column(name = "status")
    private String status;

    @Column(name = "room_number")
    private Long roomNumber;

    @Column(name = "area")
    private Double area;

    @Column(name = "floor")
    private Long floor;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HouseholdEntity> houseHold;
}
