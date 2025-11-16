package BlueMoon.example.BlueMoon.service.impl;

import BlueMoon.example.BlueMoon.dto.request.vehicle.AddVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.SearchVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.UpdateVehicleRequest;
import BlueMoon.example.BlueMoon.dto.response.VehicleResponse;
import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import BlueMoon.example.BlueMoon.entity.VehicleEntity;
import BlueMoon.example.BlueMoon.repository.HouseholdRepository;
import BlueMoon.example.BlueMoon.repository.VehicleRepository;
import BlueMoon.example.BlueMoon.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    
    private final VehicleRepository vehicleRepository;
    private final HouseholdRepository householdRepository;

    @Override
    @Transactional
    public VehicleResponse addVehicle(AddVehicleRequest request) {

        if (request.getHouseholdId() == null) {
            throw new IllegalArgumentException("Household ID không được để trống");
        }
        
        if (request.getPlateNumber() == null || request.getPlateNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Biển số xe không được để trống");
        }
        
        // Kiểm tra household có tồn tại không
        HouseholdEntity household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hộ gia đình với ID: " + request.getHouseholdId()));
        
        // Kiểm tra biển số xe đã tồn tại chưa
        if (vehicleRepository.existsByPlateNumber(request.getPlateNumber())) {
            throw new IllegalArgumentException("Biển số xe " + request.getPlateNumber() + " đã tồn tại trong hệ thống");
        }
        
        // Lưu thông tin vào Database
        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setType(request.getType().toLowerCase()); // Chuẩn hóa về chữ thường
        vehicle.setBasementFloor(request.getBasementFloor());
        vehicle.setLocation(request.getLocation());
        vehicle.setHousehold(household);
        
        VehicleEntity savedVehicle = vehicleRepository.save(vehicle);
        
        // Bước 7: Thông báo tạo khoản thu thành công
        return VehicleResponse.fromEntity(savedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long vehicleId) {

        // Kiểm tra phương tiện có tồn tại không
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phương tiện với ID: " + vehicleId));
        

        vehicleRepository.delete(vehicle);

    }
    

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long vehicleId, UpdateVehicleRequest request) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phương tiện với ID: " + vehicleId));

        //Sửa các thông tin cần thiết
        // Chỉ cập nhật các trường không null
        if (request.getPlateNumber() != null && !request.getPlateNumber().trim().isEmpty()) {
            // Kiểm tra biển số mới đã tồn tại chưa (trừ chính nó)
            vehicleRepository.findByPlateNumber(request.getPlateNumber())
                    .ifPresent(existingVehicle -> {
                        if (!existingVehicle.getVehicleId().equals(vehicleId)) {
                            throw new IllegalArgumentException("Biển số xe " + request.getPlateNumber() + " đã tồn tại trong hệ thống");
                        }
                    });
            vehicle.setPlateNumber(request.getPlateNumber());
        }
        
        if (request.getType() != null && !request.getType().trim().isEmpty()) {
            vehicle.setType(request.getType().toLowerCase());
        }
        
        if (request.getBasementFloor() != null) {
            vehicle.setBasementFloor(request.getBasementFloor());
        }
        
        if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
            vehicle.setLocation(request.getLocation());
        }
        
        // Sửa phương tiện đã chọn và update Database
        VehicleEntity updatedVehicle = vehicleRepository.save(vehicle);
        
        return VehicleResponse.fromEntity(updatedVehicle);

    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> searchVehicles(SearchVehicleRequest request) {

        // Hiển thị list phương tiện ứng với thông tin người dùng tìm
        List<VehicleEntity> vehicles = vehicleRepository.searchVehicles(
                request.getPlateNumber(),
                request.getType() != null ? request.getType().toLowerCase() : null,
                request.getLocation()
        );
        
        // Không có phương tiện nào khớp thông tin tìm kiếm
        if (vehicles.isEmpty()) {
            return List.of(); //  list rỗng
        }
        
        // Hiển thị giao diện sơ đồ phương tiện
        return vehicles.stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }
    

     //Lấy thông tin chi tiết một phương tiện
    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long vehicleId) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phương tiện với ID: " + vehicleId));
        
        return VehicleResponse.fromEntity(vehicle);
    }
    

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }
}

