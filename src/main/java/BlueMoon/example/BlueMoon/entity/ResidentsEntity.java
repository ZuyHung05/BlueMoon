package BlueMoon.example.BlueMoon.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "residents")
@NoArgsConstructor
@AllArgsConstructor
public class ResidentsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resident_id")
    private Long residentId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender; // 'M' hoặc 'F'

    @Column(name = "family_role")
    private String familyRole;

    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "job")
    private String job;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StayAbsenceRecordEntity> residents;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChangeHistoryEntity> changeHistories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private HouseholdEntity household;
}
