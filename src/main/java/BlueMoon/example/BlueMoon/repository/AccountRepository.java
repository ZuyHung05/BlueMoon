package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    Optional<AccountEntity> findByUsername(String username);
    
    @Query("SELECT a FROM AccountEntity a WHERE " +
           "(:role IS NULL OR LOWER(CAST(a.role AS string)) = LOWER(:role)) AND " +
           "(:query IS NULL OR LOWER(CAST(a.username AS string)) LIKE :query " +
           "OR CAST(a.phone AS string) LIKE :query)")
    List<AccountEntity> searchAccounts(@Param("query") String query, @Param("role") String role);
}
