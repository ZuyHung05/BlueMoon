package BlueMoon.example.BlueMoon.repository;

import BlueMoon.example.BlueMoon.entity.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, Long> {
    
    // Tìm theo household_id
    List<VehicleEntity> findByHousehold_HouseholdId(Long householdId);
    
    // Tìm theo biển số
    Optional<VehicleEntity> findByPlateNumber(String plateNumber);
    
    // Check xem biển này có tồn tại chưa
    boolean existsByPlateNumber(String plateNumber);
    
    // search theo nhiều thuộc tính (plate_number, type, location)
    @Query("SELECT v FROM VehicleEntity v WHERE " +
           "(:plateNumber IS NULL OR v.plateNumber LIKE %:plateNumber%) AND " +
           "(:type IS NULL OR v.type = :type) AND " +
           "(:location IS NULL OR v.location LIKE %:location%)")
    List<VehicleEntity> searchVehicles(
        @Param("plateNumber") String plateNumber,
        @Param("type") String type,
        @Param("location") String location
    );
    
    // Đếm số lượng phương tiện của một hộ gia đình
    long countByHousehold_HouseholdId(Long householdId);
}

