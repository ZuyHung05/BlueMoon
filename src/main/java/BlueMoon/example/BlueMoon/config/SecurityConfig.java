// Tạm thời loại bỏ hash

package BlueMoon.example.BlueMoon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF để API hoạt động dễ dàng
                .cors(cors -> cors.configure(http)) // Kích hoạt cấu hình CORS bên Controller
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login").permitAll() // Cho phép truy cập login không cần auth
                        .requestMatchers("/api/vehicles/**").permitAll() // Tạm thời cho phép truy cập vehicles không
                                                                         // cần auth
                        .anyRequest().authenticated() // Các request khác phải đăng nhập
                );
        return http.build();
    }
}