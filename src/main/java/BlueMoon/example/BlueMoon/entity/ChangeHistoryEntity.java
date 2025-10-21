package BlueMoon.example.BlueMoon.entity;

import BlueMoon.example.BlueMoon.serializable.ChangeHistoryId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "change_history")
@NoArgsConstructor
@AllArgsConstructor
public class ChangeHistoryEntity {
    @EmbeddedId
    private ChangeHistoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("residentId")
    @JoinColumn(name = "resident_id")
    private ResidentsEntity resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("householdId")
    @JoinColumn(name = "household_id")
    private HouseholdEntity household;

    @Column(name = "change_type")
    private Long changeType;

    @Column(name = "date", nullable = false)
    private LocalDate date;
}
