package BlueMoon.example.BlueMoon.dto.request.vehicle;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @NotNull(message = "Số phòng không được để trống")
    @JsonProperty("roomNumber")
    private Long roomNumber;

    @NotBlank(message = "Biển số xe không được để trống")
    @JsonProperty("plateNumber")
    private String plateNumber;

    @NotBlank(message = "Loại xe không được để trống")
    @Pattern(regexp = "^(car|bike|Car|Bike)$", message = "Loại xe phải là 'car' hoặc 'bike'")
    @JsonProperty("type")
    private String type;

    @JsonProperty("basementFloor")
    private Long basementFloor;

    @NotBlank(message = "Vị trí không được để trống")
    @JsonProperty("location")
    private String location;
}
