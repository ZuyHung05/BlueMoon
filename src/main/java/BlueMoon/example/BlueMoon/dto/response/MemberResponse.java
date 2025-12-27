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
public class MemberResponse {
    
    private Long residentId;
    private String fullName;
    private String idNumber; // CCCD
    private String familyRole; // Vai trò trong gia đình
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber; // Số điện thoại
    private String job; // Công việc
}
