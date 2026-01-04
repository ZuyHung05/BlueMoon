package BlueMoon.example.BlueMoon.service.impl;

import BlueMoon.example.BlueMoon.dto.request.vehicle.AddVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.SearchVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.UpdateVehicleRequest;
import BlueMoon.example.BlueMoon.dto.response.VehicleResponse;
import BlueMoon.example.BlueMoon.entity.ApartmentEntity;
import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import BlueMoon.example.BlueMoon.entity.VehicleEntity;
import BlueMoon.example.BlueMoon.repository.VehicleRepository;
import BlueMoon.example.BlueMoon.repository.resident.ApartmentRepository;
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
    private final ApartmentRepository apartmentRepository;

    /**
     * Kiểm tra vị trí đỗ xe hợp lệ theo loại xe
     * - Xe máy (bike): A1-I7 (chữ A-I, số 1-7)
     * - Ô tô (car): J1-O5 (chữ J-O, số 1-5)
     */
    private void validateParkingLocation(String location, String type) {
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Vị trí đỗ xe không được để trống");
        }

        location = location.trim().toUpperCase();

        // Kiểm tra format: phải là chữ cái + số (VD: A1, J5)
        if (!location.matches("^[A-Z]\\d+$")) {
            throw new IllegalArgumentException(
                    "Vị trí đỗ xe không đúng định dạng. Phải là chữ cái + số (VD: A1, J5)");
        }

        char zone = location.charAt(0);
        int spotNumber = Integer.parseInt(location.substring(1));

        String normalizedType = type.toLowerCase();

        if ("bike".equals(normalizedType)) {
            // Xe máy: A-I, số 1-7
            if (zone < 'A' || zone > 'I') {
                throw new IllegalArgumentException(
                        "Vị trí đỗ xe máy không hợp lệ. Khu vực xe máy từ A đến I (VD: A1, B5, I7)");
            }
            if (spotNumber < 1 || spotNumber > 7) {
                throw new IllegalArgumentException(
                        "Số vị trí đỗ xe máy không hợp lệ. Vị trí xe máy từ 1 đến 7 (VD: A1, A7)");
            }
        } else if ("car".equals(normalizedType)) {
            // Ô tô: J-O, số 1-5
            if (zone < 'J' || zone > 'O') {
                throw new IllegalArgumentException(
                        "Vị trí đỗ ô tô không hợp lệ. Khu vực ô tô từ J đến O (VD: J1, K3, O5)");
            }
            if (spotNumber < 1 || spotNumber > 5) {
                throw new IllegalArgumentException(
                        "Số vị trí đỗ ô tô không hợp lệ. Vị trí ô tô từ 1 đến 5 (VD: J1, J5)");
            }
        } else {
            throw new IllegalArgumentException(
                    "Loại xe không hợp lệ. Chỉ chấp nhận 'car' hoặc 'bike'");
        }
    }

    @Override
    @Transactional
    public VehicleResponse addVehicle(AddVehicleRequest request) {

        if (request.getRoomNumber() == null) {
            throw new IllegalArgumentException("Số phòng không được để trống");
        }

        if (request.getPlateNumber() == null || request.getPlateNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Biển số xe không được để trống");
        }

        // Tìm apartment theo room number
        ApartmentEntity apartment = apartmentRepository.findByRoomNumber(request.getRoomNumber())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phòng số: " + request.getRoomNumber()));

        // Tìm household đang ở apartment này (status = "1" - đang ở)
        HouseholdEntity household = apartment.getHouseHold().stream()
                .filter(h -> "1".equals(h.getStatus()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy hộ gia đình đang ở phòng " + request.getRoomNumber()));

        // Kiểm tra vị trí đỗ xe hợp lệ
        validateParkingLocation(request.getLocation(), request.getType());

        // Lưu thông tin vào Database
        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setType(request.getType().toLowerCase()); // Chuẩn hóa về chữ thường
        vehicle.setBasementFloor(request.getBasementFloor());
        vehicle.setLocation(request.getLocation());
        vehicle.setHousehold(household);

        VehicleEntity savedVehicle = vehicleRepository.save(vehicle);

        // Thông báo tạo thành công
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

        // Sửa các thông tin cần thiết
        // Chỉ cập nhật các trường không null
        if (request.getPlateNumber() != null && !request.getPlateNumber().trim().isEmpty()) {
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

        // Validate vị trí đỗ xe nếu có thay đổi location hoặc type
        if ((request.getLocation() != null && !request.getLocation().trim().isEmpty()) ||
                (request.getType() != null && !request.getType().trim().isEmpty())) {
            // Sử dụng giá trị mới nếu có, nếu không dùng giá trị cũ
            String locationToValidate = request.getLocation() != null && !request.getLocation().trim().isEmpty()
                    ? request.getLocation()
                    : vehicle.getLocation();
            String typeToValidate = request.getType() != null && !request.getType().trim().isEmpty()
                    ? request.getType()
                    : vehicle.getType();

            validateParkingLocation(locationToValidate, typeToValidate);
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
                request.getLocation());

        // Không có phương tiện nào khớp thông tin tìm kiếm
        if (vehicles.isEmpty()) {
            return List.of(); // list rỗng
        }

        // Hiển thị giao diện sơ đồ phương tiện
        return vehicles.stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Lấy thông tin chi tiết một phương tiện
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
