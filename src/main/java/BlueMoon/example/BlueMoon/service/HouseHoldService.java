package BlueMoon.example.BlueMoon.service;


import BlueMoon.example.BlueMoon.dto.request.HouseHoldSelectRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdCreateRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdUpdateRequest;
import BlueMoon.example.BlueMoon.dto.response.ApartmentSimpleResponse;
import BlueMoon.example.BlueMoon.dto.response.HouseholdResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HouseHoldService {

    List<HouseholdResponse> searchHouseHolds(HouseHoldSelectRequest request);
    
    List<ApartmentSimpleResponse> getAvailableApartments();
    
    HouseholdResponse createHousehold(HouseholdCreateRequest request);
    
    HouseholdResponse updateHousehold(Long householdId, HouseholdUpdateRequest request);
}
