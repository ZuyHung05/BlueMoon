package BlueMoon.example.BlueMoon.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private Long accountId;
    private String username;
    private String role;
    private String phone;
    private LocalDateTime lastLogin;
}
