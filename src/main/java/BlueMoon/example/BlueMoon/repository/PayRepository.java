package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.PayEntity;
import BlueMoon.example.BlueMoon.serializable.PayId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayRepository extends JpaRepository<PayEntity, PayId> {
}
