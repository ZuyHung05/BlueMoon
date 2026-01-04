package BlueMoon.example.BlueMoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdUpdateRequest {
    
    private String apartment; // Room number (string) - sẽ convert sang apartment_id
    private LocalDate startDay;
    private String status; // "1" hoặc "0" - sẽ convert sang số
}
