// Tạm thời loại bỏ hash

package BlueMoon.example.BlueMoon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @org.springframework.beans.factory.annotation.Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF để API hoạt động dễ dàng
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Sử dụng cấu hình CORS chuẩn từ Bean
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login").permitAll() // Cho phép truy cập login không cần auth
                        .requestMatchers("/api/vehicles/**").permitAll() // Tạm thời cho phép truy cập vehicles
                        .requestMatchers("/resident/**").permitAll() // Tạm thời cho phép truy cập resident
                        .requestMatchers("/household/**").permitAll() // Tạm thời cho phép truy cập household
                        .requestMatchers("/default-fee/**").permitAll() // Tạm thời cho phép truy cập default-fee
                        .requestMatchers("/payment-periods/**").permitAll() // Tạm thời cho phép truy cập payment-periods
                        .anyRequest().authenticated() // Các request khác phải đăng nhập
                )
                .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Sử dụng AllowedOriginPatterns để hỗ trợ các port khác nhau và tránh lỗi "*" khi dùng credentials
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "https://*.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}