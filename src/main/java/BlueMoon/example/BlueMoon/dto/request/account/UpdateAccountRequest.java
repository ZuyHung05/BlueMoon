package BlueMoon.example.BlueMoon.dto.request.account;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAccountRequest {
    private String password; // Optional

    @NotBlank(message = "Quyền hạn không được để trống")
    private String role;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;
}
