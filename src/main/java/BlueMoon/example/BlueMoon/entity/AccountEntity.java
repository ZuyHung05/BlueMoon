package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "account") 
@Data
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id") 
    private Long accountId;

    @Column(nullable = false, unique = true)
    private String username; 

    @Column(nullable = false)
    private String password; 

    @Column(length = 20)
    private String role;

    @Column(nullable = false)
    private String phone;

    @Column(name = "last_login")
    private LocalDateTime lastLogin; 
}

