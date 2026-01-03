package BlueMoon.example.BlueMoon.controller.dashboard;

import BlueMoon.example.BlueMoon.dto.BaseResponse;
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
    public BaseResponse getFeeStats() {
        return BaseResponse.success(dashboardService.getFeeStats());
    }

    @GetMapping("/resident-stats")
    public BaseResponse getResidentStats() {
        return BaseResponse.success(dashboardService.getResidentStats());
    }
}
