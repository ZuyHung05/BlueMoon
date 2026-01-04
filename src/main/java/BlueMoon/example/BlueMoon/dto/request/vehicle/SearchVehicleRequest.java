package BlueMoon.example.BlueMoon.dto.request.vehicle;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchVehicleRequest {
    
    private String plateNumber;  // Tìm theo biển số
    
    private String type;  // Tìm theo loại xe (car/bike)
    
    private String location;  // Tìm theo vị trí
}

