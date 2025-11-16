package BlueMoon.example.BlueMoon.dto.response;

import BlueMoon.example.BlueMoon.entity.VehicleEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    
    private Long vehicleId;
    
    private Long householdId;
    
    private String plateNumber;
    
    private String type;
    
    private Long basementFloor;
    
    private String location;
    
    // Constructor để convert từ Entity sang Response
    public static VehicleResponse fromEntity(VehicleEntity entity) {
        return VehicleResponse.builder()
                .vehicleId(entity.getVehicleId())
                .householdId(entity.getHousehold().getHouseholdId())
                .plateNumber(entity.getPlateNumber())
                .type(entity.getType())
                .basementFloor(entity.getBasementFloor())
                .location(entity.getLocation())
                .build();
    }
}

