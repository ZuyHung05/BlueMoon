package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.vehicle.AddVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.SearchVehicleRequest;
import BlueMoon.example.BlueMoon.dto.request.vehicle.UpdateVehicleRequest;
import BlueMoon.example.BlueMoon.dto.response.VehicleResponse;

import java.util.List;

public interface VehicleService {
    
    VehicleResponse addVehicle(AddVehicleRequest request);

    void deleteVehicle(Long vehicleId);

    VehicleResponse updateVehicle(Long vehicleId, UpdateVehicleRequest request);

    List<VehicleResponse> searchVehicles(SearchVehicleRequest request);

    VehicleResponse getVehicleById(Long vehicleId);

    List<VehicleResponse> getAllVehicles();
}

