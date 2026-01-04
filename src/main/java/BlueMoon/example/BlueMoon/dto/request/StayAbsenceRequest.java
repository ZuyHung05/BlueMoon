package BlueMoon.example.BlueMoon.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StayAbsenceRequest {

    @NotNull(message = "Mã cư dân không được để trống")
    private Long residentId;

    @NotNull(message = "Loại đăng ký không được để trống")
    private String recordType; // "temporary_residence" hoặc "temporary_absence"

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime start;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime end;

    private String reason;
}
