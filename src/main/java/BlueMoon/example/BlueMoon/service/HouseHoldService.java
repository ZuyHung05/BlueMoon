package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.HouseHoldSelectRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdCreateRequest;
import BlueMoon.example.BlueMoon.dto.request.HouseholdUpdateRequest;
import BlueMoon.example.BlueMoon.dto.request.StayAbsenceRequest;
import BlueMoon.example.BlueMoon.dto.response.ApartmentSimpleResponse;
import BlueMoon.example.BlueMoon.dto.response.HouseholdResponse;
import BlueMoon.example.BlueMoon.dto.response.ResidenceHistoryResponse;
import BlueMoon.example.BlueMoon.dto.response.StayAbsenceRecordResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HouseHoldService {

    List<HouseholdResponse> searchHouseHolds(HouseHoldSelectRequest request);

    List<ApartmentSimpleResponse> getAvailableApartments();

    HouseholdResponse createHousehold(HouseholdCreateRequest request);

    HouseholdResponse updateHousehold(Long householdId, HouseholdUpdateRequest request);

    List<HouseholdResponse> getAllHouseholds();

    List<ResidenceHistoryResponse> getResidenceHistory(Long householdId);

    List<StayAbsenceRecordResponse> getStayAbsenceRecords(Long householdId);

    StayAbsenceRecordResponse createStayAbsenceRecord(Long householdId, StayAbsenceRequest request);

    void deleteStayAbsenceRecord(Long absenceId);
}
