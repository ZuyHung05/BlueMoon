package BlueMoon.example.BlueMoon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentSimpleResponse {
    
    private Long apartmentId;
    private Long roomNumber;
    private Double area;
    private Long floor;
    private String status;
}
