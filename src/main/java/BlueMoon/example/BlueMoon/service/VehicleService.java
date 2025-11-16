package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.vehicle.AddVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.SearchVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.UpdateVehicleRequest;
import BlueMoon.example.BlueMoon.dto.response.VehicleResponse;

import java.util.List;

public interface VehicleService {
    
    /**
     * Thêm phương tiện mới
     * @param request Thông tin phương tiện cần thêm
     * @return VehicleResponse
     */
    VehicleResponse addVehicle(AddVehicleRequest request);
    
    /**
     * Xóa phương tiện theo ID
     * @param vehicleId ID của phương tiện cần xóa
     */
    void deleteVehicle(Long vehicleId);
    
    /**
     * Sửa thông tin phương tiện
     * @param vehicleId ID của phương tiện cần sửa
     * @param request Thông tin cần cập nhật
     * @return VehicleResponse
     */
    VehicleResponse updateVehicle(Long vehicleId, UpdateVehicleRequest request);
    
    /**
     * Tìm kiếm phương tiện theo nhiều tiêu chí
     * @param request Tiêu chí tìm kiếm (plateNumber, type, location)
     * @return Danh sách phương tiện tìm được
     */
    List<VehicleResponse> searchVehicles(SearchVehicleRequest request);
    
    /**
     * Lấy thông tin chi tiết một phương tiện theo ID
     * @param vehicleId ID của phương tiện
     * @return VehicleResponse
     */
    VehicleResponse getVehicleById(Long vehicleId);
    
    /**
     * Lấy danh sách tất cả phương tiện
     * @return Danh sách tất cả phương tiện
     */
    List<VehicleResponse> getAllVehicles();
}

