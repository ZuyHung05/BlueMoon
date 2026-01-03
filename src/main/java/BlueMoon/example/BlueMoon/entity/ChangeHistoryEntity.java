package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "change_history")
@NoArgsConstructor
@AllArgsConstructor
public class ChangeHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    @ToString.Exclude
    private ResidentsEntity resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private HouseholdEntity household;

    @Column(name = "change_type")
    private Long changeType;

    @Column(name = "date", nullable = false)
    private LocalDate date;
}
