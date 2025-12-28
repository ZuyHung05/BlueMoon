package BlueMoon.example.BlueMoon.service.login;

import BlueMoon.example.BlueMoon.dto.response.login.LoginResponse;
import BlueMoon.example.BlueMoon.dto.request.login.LoginRequest;
import BlueMoon.example.BlueMoon.entity.AccountEntity;
import BlueMoon.example.BlueMoon.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BlueMoon.example.BlueMoon.utils.JwtUtil jwtUtil;

    // Key bí mật đã được chuyển sang JwtUtil

    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        
        System.out.println("DEBUG: Login attempt for username: [" + username + "]");
        
        // 1. Tìm user trong DB
        AccountEntity account = accountRepository.findByUsername(username)
            .orElseGet(() -> {
                System.out.println("DEBUG: Username not found in database: [" + username + "]");
                return null;
            });

        if (account == null) {
            System.out.println("DEBUG: Username not found: [" + username + "]");
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        String storedPassword = account.getPassword() != null ? account.getPassword().trim() : "";
        System.out.println("DEBUG: User found: " + account.getUsername() + ", Role: " + account.getRole());

        // 2. Kiểm tra mật khẩu
        if (!passwordEncoder.matches(password, storedPassword)) {
            System.out.println("DEBUG: Password mismatch for user: " + username);
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        // 3. Xác định trang chuyển hướng dựa trên Role
        String role = account.getRole() != null ? account.getRole().toUpperCase() : "";
        String redirectUrl = "/"; // Mặc định

        if ("ADMIN".equals(role)) {
            redirectUrl = "/admin/dashboard";
        } else if ("MANAGER".equals(role)) {
            redirectUrl = "/manager/dashboard";
        } else if ("ACCOUNTANT".equals(role)) {
            redirectUrl = "/accountant/dashboard";
        } else {
            // Trường hợp không thuộc các role quản trị
            System.out.println("DEBUG: Role not authorized for dashboard: " + role);
            throw new RuntimeException("Tài khoản của bạn không có quyền truy cập vào hệ thống quản lý.");
        }

        System.out.println("DEBUG: Login successful. Role: " + role + ", Redirecting to: " + redirectUrl);

        // 4. Cập nhật last_login [cite: 27]
        account.setLastLogin(LocalDateTime.now());
        accountRepository.save(account);

        // 5. Tạo JWT Token
        // 5. Tạo JWT Token
        String token = jwtUtil.generateToken(account.getUsername(), account.getRole(), String.valueOf(account.getAccountId()));

        // 6. Trả về kết quả để Frontend điều hướng
        return new LoginResponse(token, account.getUsername(), account.getRole(), "/admin/dashboard");
    }
}