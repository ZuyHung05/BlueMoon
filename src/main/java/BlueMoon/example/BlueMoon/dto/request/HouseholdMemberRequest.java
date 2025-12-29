package BlueMoon.example.BlueMoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMemberRequest {
    
    private Long residentId;
    private String familyRole; // Vai trò: Chủ hộ, Vợ, Chồng, Con, etc.
}
