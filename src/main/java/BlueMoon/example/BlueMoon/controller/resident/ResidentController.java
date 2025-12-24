package BlueMoon.example.BlueMoon.controller.resident;

import BlueMoon.example.BlueMoon.dto.ApiResponse;
import BlueMoon.example.BlueMoon.dto.BaseResponse;
import BlueMoon.example.BlueMoon.dto.request.ResidentAddRequest;
import BlueMoon.example.BlueMoon.dto.request.ResidentSelectRequest;
import BlueMoon.example.BlueMoon.dto.response.PageResponse;
import BlueMoon.example.BlueMoon.dto.response.ResidentResponse;
import BlueMoon.example.BlueMoon.service.resident.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resident")
public class ResidentController {

    @Autowired
    private ResidentService residentService;

    @GetMapping("/jobs")
    public ResponseEntity<?> getJobs() {
        List<?> jobs = residentService.getAllJobs();
        return new ResponseEntity<>(BaseResponse.success("Lấy danh sách công việc thành công", jobs), HttpStatus.OK);
    }

// ...

    @PostMapping("/search")
    ApiResponse<PageResponse<ResidentResponse>> searchResidents(@RequestBody ResidentSelectRequest request) {
        PageResponse<ResidentResponse> results = residentService.searchResidents(request);
        return ApiResponse.<PageResponse<ResidentResponse>>builder()
                .result(results)
                .build();
    }

    @PostMapping("/add")
    ApiResponse<ResidentResponse> addResident(@RequestBody ResidentAddRequest request) {
        ResidentResponse response = residentService.addResident(request);
        return ApiResponse.<ResidentResponse>builder()
                .message("Thêm cư dân thành công")
                .result(response)
                .build();
    }

    @PostMapping("/delete1")
    ApiResponse<Void> deleteResident(@RequestBody ResidentResponse request) {
        return ApiResponse.<Void>builder()
                .message("Xóa cư dân thành công")
                .result(residentService.deleteResident(request))
                .build();
    }

    @PostMapping("/update/{residentId}")
    ApiResponse<Void> updateResident(@PathVariable ("residentId") Long residentId,  @RequestBody ResidentAddRequest request) {
        residentService.updateResident(residentId, request);
        return ApiResponse.<Void>builder()
                .message("Cập nhật cư dân thành công")
                .build();
    }

}
