package BlueMoon.example.BlueMoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResidentSelectRequest {
    private String searchKeyword; 
    private String gender; 
    private Boolean hasHousehold; 
    private String familyRole; 
    

    private int page = 1;      
    private int pageSize = 10; 
}
