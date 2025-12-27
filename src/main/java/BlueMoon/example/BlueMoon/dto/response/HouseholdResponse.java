package BlueMoon.example.BlueMoon.dto.response;

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
public class HouseholdResponse {
    
    private Long householdId;
    
    private String headOfHouseholdName; // Tên chủ hộ
    
    private Integer memberCount; // Số lượng thành viên trong hộ
    
    private LocalDate startDay; // Ngày vào
    
    private String status; // Trạng thái
    
    private String apartment; // Số phòng (room_number từ ApartmentEntity)
    
    private List<MemberResponse> members; // Danh sách thành viên
}


