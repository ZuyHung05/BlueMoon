package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "stay_absence_record")
@NoArgsConstructor
@AllArgsConstructor
public class StayAbsenceRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "absence_id")
    private Long absenceId;

    @Column(name = "record_type")
    private String recordType;

    @Column(name = "start")
    private LocalDateTime start;

    @Column(name = "\"end\"")
    private LocalDateTime end;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ResidentsEntity resident;
}
