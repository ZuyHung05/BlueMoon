package BlueMoon.example.BlueMoon.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HouseHoldSelectRequest {
    private String searchKeyword;
    private Long status;
}
