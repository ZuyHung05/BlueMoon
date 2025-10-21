package BlueMoon.example.BlueMoon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.management.relation.Role;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "account")
@NoArgsConstructor
@AllArgsConstructor
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "phone")
    private String phone;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;
}

