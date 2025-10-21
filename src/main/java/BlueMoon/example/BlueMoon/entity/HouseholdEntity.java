package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "household")
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "household_id")
    private Long householdId;


    @Column(name = "status")
    private String status;

    @Column(name = "start_day", nullable = false)
    private LocalDate startDay;

    @Column(name = "head_of_household", nullable = false)
    private Long headOfHousehold;

    // change_history
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChangeHistoryEntity> changeHistory;

    // vehicle
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VehicleEntity> vehicle;

    // apartment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private ApartmentEntity apartment;

    //residents
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResidentsEntity> residents;

    //fees
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FeesEntity> fees;

    // pay
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PayEntity> pay;
}
