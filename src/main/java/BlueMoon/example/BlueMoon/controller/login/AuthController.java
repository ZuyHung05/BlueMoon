package BlueMoon.example.BlueMoon.controller.login;

import BlueMoon.example.BlueMoon.dto.request.login.LoginRequest;
import BlueMoon.example.BlueMoon.service.login.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép React gọi API
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login") // 
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (RuntimeException e) {
            // Trả về lỗi 401 hoặc 400 tùy logic (Luồng 5a, 6a) [cite: 35]
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Class wrapper cho lỗi đơn giản
    static class ErrorResponse {
        public String message;
        public ErrorResponse(String message) { this.message = message; }
    }
}
