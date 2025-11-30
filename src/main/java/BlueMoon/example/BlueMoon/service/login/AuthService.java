package BlueMoon.example.BlueMoon.service.login;

import BlueMoon.example.BlueMoon.dto.response.login.LoginResponse;
import BlueMoon.example.BlueMoon.dto.request.login.LoginRequest;
import BlueMoon.example.BlueMoon.entity.AccountEntity;
import BlueMoon.example.BlueMoon.repository.AccountRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Key bí mật để ký JWT (Trong thực tế nên để trong biến môi trường)
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public LoginResponse login(LoginRequest request) {
        // 1. Tìm user trong DB (Luồng 6a: Kiểm tra user tồn tại) [cite: 33, 35]
        AccountEntity account = accountRepository.findByUsername(request.getUsername()) // getUsername()
            .orElseThrow(() -> new RuntimeException("Username hoặc mật khẩu không đúng"));

        // 2. Kiểm tra mật khẩu (Luồng 6a) [cite: 35]
        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Username hoặc mật khẩu không đúng");
        }

        // 3. Kiểm tra quyền ADMIN (Yêu cầu hiện tại)
        if (!"ADMIN".equalsIgnoreCase(account.getRole())) {
            throw new RuntimeException("Bạn không có quyền truy cập trang quản trị (Role: " + account.getRole() + ")");
        }

        // 4. Cập nhật last_login [cite: 27]
        account.setLastLogin(LocalDateTime.now());
        accountRepository.save(account);

        // 5. Tạo JWT Token
        String token = Jwts.builder()
                .setSubject(account.getUsername())
                .claim("role", account.getRole())
                .claim("id", account.getAccountId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 giờ
                .signWith(SECRET_KEY)
                .compact();

        // 6. Trả về kết quả để Frontend điều hướng
        return new LoginResponse(token, account.getUsername(), account.getRole(), "/admin/dashboard");
    }
}