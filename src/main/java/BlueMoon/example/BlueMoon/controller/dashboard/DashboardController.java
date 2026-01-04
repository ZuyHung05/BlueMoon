package BlueMoon.example.BlueMoon.controller.dashboard;

import BlueMoon.example.BlueMoon.dto.response.ApiResponse;
import BlueMoon.example.BlueMoon.dto.dashboard.DashboardStatsResponse;
import BlueMoon.example.BlueMoon.service.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/fee-stats")
    public ApiResponse<DashboardStatsResponse.FeeStats> getFeeStats() {
        return ApiResponse.success("Lấy thống kê thu phí thành công", dashboardService.getFeeStats());
    }

    @GetMapping("/resident-stats")
    public ApiResponse<DashboardStatsResponse.ResidentStats> getResidentStats() {
        return ApiResponse.success("Lấy thống kê cư dân thành công", dashboardService.getResidentStats());
    }
}
