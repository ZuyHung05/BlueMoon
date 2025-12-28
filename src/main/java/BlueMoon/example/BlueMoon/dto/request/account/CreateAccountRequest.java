package BlueMoon.example.BlueMoon.dto.request.account;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAccountRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotBlank(message = "Quyền hạn không được để trống")
    private String role;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;
}
