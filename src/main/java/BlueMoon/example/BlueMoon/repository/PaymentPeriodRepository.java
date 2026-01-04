package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.PaymentPeriodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentPeriodRepository extends JpaRepository<PaymentPeriodEntity, Long> {
        Optional<PaymentPeriodEntity> findByDescription(String description);

        // standard JPA method
        java.util.List<PaymentPeriodEntity> findByStartDateBetween(java.time.LocalDate startDate,
                        java.time.LocalDate endDate);
}
