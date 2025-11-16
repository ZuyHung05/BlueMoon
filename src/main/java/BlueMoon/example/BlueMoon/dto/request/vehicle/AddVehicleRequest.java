package BlueMoon.example.BlueMoon.dto.request.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddVehicleRequest {
    
    @NotNull(message = "Household ID không được để trống")
    private Long householdId;
    
    @NotBlank(message = "Biển số xe không được để trống")
    @Pattern(regexp = "^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$", 
             message = "Biển số xe không đúng định dạng (VD: 30A-12345)")
    private String plateNumber;
    
    @NotBlank(message = "Loại xe không được để trống")
    @Pattern(regexp = "^(car|bike|Car|Bike)$", 
             message = "Loại xe phải là 'car' hoặc 'bike'")
    private String type;
    
    private Long basementFloor;
    
    @NotBlank(message = "Vị trí không được để trống")
    private String location;
}

