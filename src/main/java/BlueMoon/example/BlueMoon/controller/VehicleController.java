package BlueMoon.example.BlueMoon.controller;

import BlueMoon.example.BlueMoon.dto.request.vehicle.AddVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.SearchVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.UpdateVehicleRequest;
import BlueMoon.example.BlueMoon.dto.response.ApiResponse;
import BlueMoon.example.BlueMoon.dto.response.VehicleResponse;
import BlueMoon.example.BlueMoon.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    
    private final VehicleService vehicleService;
    
    /**
     * API: Thêm phương tiện mới
     * Method: POST
     * URL: /api/vehicles
     * Body: AddVehicleRequest
     */
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(@Valid @RequestBody AddVehicleRequest request) {
        try {
            VehicleResponse response = vehicleService.addVehicle(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm phương tiện thành công", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    /**
     * API: Xóa phương tiện
     * Method: DELETE
     * URL: /api/vehicles/{vehicleId}
     */
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long vehicleId) {
        try {
            vehicleService.deleteVehicle(vehicleId);
            return ResponseEntity
                    .ok(ApiResponse.success("Xóa phương tiện thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    /**
     * API: Sửa thông tin phương tiện
     * Method: PUT
     * URL: /api/vehicles/{vehicleId}
     * Body: UpdateVehicleRequest
     */
    @PutMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable Long vehicleId,
            @Valid @RequestBody UpdateVehicleRequest request) {
        try {
            VehicleResponse response = vehicleService.updateVehicle(vehicleId, request);
            return ResponseEntity
                    .ok(ApiResponse.success("Cập nhật phương tiện thành công", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    /**
     * API: Tìm kiếm phương tiện theo nhiều tiêu chí
     * Method: GET
     * URL: /api/vehicles/search?plateNumber=xxx&type=xxx&location=xxx
     * Query Parameters: plateNumber (optional), type (optional), location (optional)
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> searchVehicles(
            @RequestParam(required = false) String plateNumber,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location) {
        try {
            SearchVehicleRequest request = new SearchVehicleRequest(plateNumber, type, location);
            List<VehicleResponse> responses = vehicleService.searchVehicles(request);
            
            if (responses.isEmpty()) {
                return ResponseEntity
                        .ok(ApiResponse.success("Không tìm thấy phương tiện nào khớp với điều kiện tìm kiếm", responses));
            }
            
            return ResponseEntity
                    .ok(ApiResponse.success("Tìm kiếm thành công, tìm thấy " + responses.size() + " phương tiện", responses));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    /**
     * API: Lấy thông tin chi tiết một phương tiện
     * Method: GET
     * URL: /api/vehicles/{vehicleId}
     */
    @GetMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Long vehicleId) {
        try {
            VehicleResponse response = vehicleService.getVehicleById(vehicleId);
            return ResponseEntity
                    .ok(ApiResponse.success("Lấy thông tin phương tiện thành công", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    /**
     * API: Lấy danh sách tất cả phương tiện
     * Method: GET
     * URL: /api/vehicles
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getAllVehicles() {
        try {
            List<VehicleResponse> responses = vehicleService.getAllVehicles();
            return ResponseEntity
                    .ok(ApiResponse.success("Lấy danh sách phương tiện thành công", responses));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }
}

