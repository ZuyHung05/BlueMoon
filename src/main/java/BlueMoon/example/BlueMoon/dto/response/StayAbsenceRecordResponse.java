package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StayAbsenceRecordResponse {
    private Long absenceId;
    private Long residentId;
    private String residentName;
    private String idNumber;
    private String recordType; // "temporary_residence" hoặc "temporary_absence"
    private LocalDateTime start;
    private LocalDateTime end;
    private String reason;
}
