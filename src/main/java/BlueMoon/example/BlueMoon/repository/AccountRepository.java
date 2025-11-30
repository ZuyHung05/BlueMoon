package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    Optional<AccountEntity> findByUsername(String username);
}
