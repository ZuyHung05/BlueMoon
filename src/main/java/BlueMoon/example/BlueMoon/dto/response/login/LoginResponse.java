package BlueMoon.example.BlueMoon.dto.response.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private String redirectUrl;
}