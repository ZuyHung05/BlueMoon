package BlueMoon.example.BlueMoon.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Use a fixed secret key for development stability (so tokens survive restarts if desired, 
    // but for security usually we rotate. Here using a generated one for now but making it static accessible if needed, 
    // OR better, sticking to a consistent usage). 
    // However, to ensure AuthService and Filter use SAME key, we expose it or use methods here.
    // For simplicity and security best practice in this context, let's use a consistent key generated at start 
    // BUT we must ensure tokens from AuthService use THIS util.
    
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 3600000; // 1 hour

    public String generateToken(String username, String role, String accountId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("id", accountId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("Invalid JWT Token: " + e.getMessage());
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
