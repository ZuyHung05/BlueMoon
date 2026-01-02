package BlueMoon.example.BlueMoon.controller.resident;

import BlueMoon.example.BlueMoon.dto.ApiResponse;
import BlueMoon.example.BlueMoon.dto.request.HouseHoldSelectRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdCreateRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdUpdateRequest;
import BlueMoon.example.BlueMoon.dto.response.ApartmentSimpleResponse;
import BlueMoon.example.BlueMoon.dto.response.HouseholdResponse;
import BlueMoon.example.BlueMoon.service.HouseHoldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/household")
public class HouseHoldController {

    @Autowired
    private HouseHoldService houseHoldService;

    @GetMapping
    public ApiResponse<List<HouseholdResponse>> getAllHouseholds() {
        return ApiResponse.<List<HouseholdResponse>>builder()
                .result(houseHoldService.getAllHouseholds())
                .build();
    }

    @PostMapping("/search")
    ApiResponse<List<HouseholdResponse>> searchHouseHolds(@RequestBody HouseHoldSelectRequest request) {
        List<HouseholdResponse> results = houseHoldService.searchHouseHolds(request);
        return ApiResponse.<List<HouseholdResponse>>builder()
                .result(results)
                .build();
    }
    
    @GetMapping("/available-apartments")
    ApiResponse<List<ApartmentSimpleResponse>> getAvailableApartments() {
        List<ApartmentSimpleResponse> apartments = houseHoldService.getAvailableApartments();
        return ApiResponse.<List<ApartmentSimpleResponse>>builder()
                .result(apartments)
                .build();
    }
    
    @PostMapping("/create")
    ApiResponse<HouseholdResponse> createHousehold(@RequestBody HouseholdCreateRequest request) {
        HouseholdResponse response = houseHoldService.createHousehold(request);
        return ApiResponse.<HouseholdResponse>builder()
                .message("Tạo hộ khẩu thành công")
                .result(response)
                .build();
    }
    
    @PutMapping("/update/{householdId}")
    ApiResponse<HouseholdResponse> updateHousehold(
            @PathVariable Long householdId,
            @RequestBody HouseholdUpdateRequest request) {
        HouseholdResponse result = houseHoldService.updateHousehold(householdId, request);
        return ApiResponse.<HouseholdResponse>builder()
                .result(result)
                .build();
    }

}
