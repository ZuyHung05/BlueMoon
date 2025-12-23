package BlueMoon.example.BlueMoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResidentSelectRequest {
    private String fullName;
    private Long householdId;
    private String gender;
    private String phoneNumber;
    private String job;
}
