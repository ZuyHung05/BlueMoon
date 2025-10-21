package BlueMoon.example.BlueMoon.serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChangeHistoryId {
    @Column(name = "resident_id")
    private Long residentId;
    @Column(name = "household_id")
    private Long householdId;
}
