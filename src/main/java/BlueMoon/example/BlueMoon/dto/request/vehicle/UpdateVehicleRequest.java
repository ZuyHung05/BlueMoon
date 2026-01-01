package BlueMoon.example.BlueMoon.dto.request.vehicle;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateVehicleRequest {

    private String plateNumber;

    @Pattern(regexp = "^(car|bike|Car|Bike)$", message = "Loại xe phải là 'car' hoặc 'bike'")
    private String type;

    private Long basementFloor;

    private String location;
}
