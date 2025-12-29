package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.PaymentPeriodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentPeriodRepository extends JpaRepository<PaymentPeriodEntity, Long> {
}
