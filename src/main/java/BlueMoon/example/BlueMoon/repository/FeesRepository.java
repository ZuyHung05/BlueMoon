package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.FeesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesRepository extends JpaRepository<FeesEntity, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM FeesEntity f WHERE f.paymentPeriod.paymentPeriodId = :paymentPeriodId")
    void deleteByPaymentPeriodId(@org.springframework.data.repository.query.Param("paymentPeriodId") Long paymentPeriodId);

    List<FeesEntity> findByPaymentPeriod_PaymentPeriodId(Long paymentPeriodId);
}
