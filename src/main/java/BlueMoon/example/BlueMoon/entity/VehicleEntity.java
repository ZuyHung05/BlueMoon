package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "vehicle")
@NoArgsConstructor
@AllArgsConstructor
public class VehicleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "plate_number")
    private String plateNumber;

    @Column(name ="type")
    private String type; // 'car' hoặc 'bike'

    @Column(name = "basement_floor")
    private Long basementFloor;

    @Column(name = "location")
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private HouseholdEntity household;
}
