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

    private String roomNumber; // Số phòng (VD: A101, B205)

    // Constructor để convert từ Entity sang Response
    public static VehicleResponse fromEntity(VehicleEntity entity) {
        return VehicleResponse.builder()
                .vehicleId(entity.getVehicleId())
                .householdId(entity.getHousehold().getHouseholdId())
                .roomNumber(String.valueOf(entity.getHousehold().getApartment().getRoomNumber())) // Convert Long to
                                                                                                  // String
                .plateNumber(entity.getPlateNumber())
                .type(entity.getType())
                .basementFloor(entity.getBasementFloor())
                .location(entity.getLocation())
                .build();
    }
}
