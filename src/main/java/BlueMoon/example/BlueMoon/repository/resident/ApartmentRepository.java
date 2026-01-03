package BlueMoon.example.BlueMoon.repository.resident;

import BlueMoon.example.BlueMoon.entity.ApartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<ApartmentEntity, Long>, JpaSpecificationExecutor<ApartmentEntity> {
    
    // Lấy danh sách apartments có status = "1" (có phòng trống)
    @Query("SELECT a FROM ApartmentEntity a WHERE a.status = '1'")
    List<ApartmentEntity> findAvailableApartments();
    
    // Tìm apartment theo room number
    Optional<ApartmentEntity> findByRoomNumber(Long roomNumber);
}
