package BlueMoon.example.BlueMoon.service.resident;


import BlueMoon.example.BlueMoon.dto.request.ResidentAddRequest;
import BlueMoon.example.BlueMoon.dto.request.ResidentSelectRequest;
import BlueMoon.example.BlueMoon.dto.response.ResidentResponse;

import BlueMoon.example.BlueMoon.dto.response.PageResponse;

import java.util.List;

public interface ResidentService {

    public List<?> getAllJobs();

    public PageResponse<ResidentResponse> searchResidents(ResidentSelectRequest request);

    ResidentResponse addResident(ResidentAddRequest request);

    Void deleteResident(ResidentResponse request);

    Void deleteResidentById(Long id);

    ResidentResponse updateResident(Long residentId, ResidentAddRequest request);
}
