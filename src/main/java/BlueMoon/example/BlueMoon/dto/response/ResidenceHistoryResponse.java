package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResidenceHistoryResponse {
    private Long residentId;
    private Long householdId;
    private String memberName;
    private String memberIdNumber;
    private String actionType; // "THÊM_THÀNH_VIÊN" or "XÓA_THÀNH_VIÊN"
    private LocalDate actionDate;
    private String performedBy; // "Admin" for now
    private String note;
}
