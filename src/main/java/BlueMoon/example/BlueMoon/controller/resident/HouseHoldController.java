package BlueMoon.example.BlueMoon.controller.resident;

import BlueMoon.example.BlueMoon.dto.ApiResponse;
import BlueMoon.example.BlueMoon.dto.request.HouseHoldSelectRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdCreateRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdUpdateRequest;
import BlueMoon.example.BlueMoon.dto.request.StayAbsenceRequest;
import BlueMoon.example.BlueMoon.dto.response.ApartmentSimpleResponse;
import BlueMoon.example.BlueMoon.dto.response.HouseholdResponse;
import BlueMoon.example.BlueMoon.dto.response.ResidenceHistoryResponse;
import BlueMoon.example.BlueMoon.dto.response.StayAbsenceRecordResponse;
import BlueMoon.example.BlueMoon.service.HouseHoldService;
import jakarta.validation.Valid;
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

    @GetMapping("/{householdId}/history")
    ApiResponse<List<ResidenceHistoryResponse>> getResidenceHistory(@PathVariable Long householdId) {
        List<ResidenceHistoryResponse> history = houseHoldService.getResidenceHistory(householdId);
        return ApiResponse.<List<ResidenceHistoryResponse>>builder()
                .result(history)
                .build();
    }

    @GetMapping("/{householdId}/stay-absence")
    ApiResponse<List<StayAbsenceRecordResponse>> getStayAbsenceRecords(@PathVariable Long householdId) {
        List<StayAbsenceRecordResponse> records = houseHoldService.getStayAbsenceRecords(householdId);
        return ApiResponse.<List<StayAbsenceRecordResponse>>builder()
                .result(records)
                .build();
    }

    @PostMapping("/{householdId}/stay-absence")
    ApiResponse<StayAbsenceRecordResponse> createStayAbsenceRecord(
            @PathVariable Long householdId,
            @Valid @RequestBody StayAbsenceRequest request) {
        StayAbsenceRecordResponse result = houseHoldService.createStayAbsenceRecord(householdId, request);
        return ApiResponse.<StayAbsenceRecordResponse>builder()
                .message("Đăng ký tạm trú/tạm vắng thành công")
                .result(result)
                .build();
    }

    @DeleteMapping("/stay-absence/{absenceId}")
    ApiResponse<Void> deleteStayAbsenceRecord(@PathVariable Long absenceId) {
        houseHoldService.deleteStayAbsenceRecord(absenceId);
        return ApiResponse.<Void>builder()
                .message("Xóa bản ghi thành công")
                .build();
    }
}
