package BlueMoon.example.BlueMoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdCreateRequest {
    
    private String apartment; // Số phòng (room number)
    private LocalDate startDay; // Ngày chuyển đến
    private String status; // "0" = Đã rời đi, "1" = Đang sinh sống
    private List<HouseholdMemberRequest> members; // Danh sách thành viên
}
