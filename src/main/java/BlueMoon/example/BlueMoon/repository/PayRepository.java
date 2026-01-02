package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.PayEntity;
import BlueMoon.example.BlueMoon.serializable.PayId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayRepository extends JpaRepository<PayEntity, PayId> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM PayEntity p WHERE p.paymentPeriod.paymentPeriodId = :paymentPeriodId")
    void deleteByPaymentPeriodId(@org.springframework.data.repository.query.Param("paymentPeriodId") Long paymentPeriodId);
}
