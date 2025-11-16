package BlueMoon.example.BlueMoon.dto.request.vehicle;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateVehicleRequest {
    
    @Pattern(regexp = "^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$", 
             message = "Biển số xe không đúng định dạng (VD: 30A-12345)")
    private String plateNumber;
    
    @Pattern(regexp = "^(car|bike|Car|Bike)$", 
             message = "Loại xe phải là 'car' hoặc 'bike'")
    private String type;
    
    private Long basementFloor;
    
    private String location;
}

