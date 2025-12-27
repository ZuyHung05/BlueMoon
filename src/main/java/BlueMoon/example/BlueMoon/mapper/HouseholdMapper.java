package BlueMoon.example.BlueMoon.mapper;

import BlueMoon.example.BlueMoon.dto.response.HouseholdResponse;
import BlueMoon.example.BlueMoon.dto.response.MemberResponse;
import BlueMoon.example.BlueMoon.entity.HouseholdEntity;
import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import BlueMoon.example.BlueMoon.repository.resident.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class HouseholdMapper {

    @Autowired
    private ResidentRepository residentRepository;

    public HouseholdResponse toHouseholdResponse(HouseholdEntity entity) {
        if (entity == null) {
            return null;
        }

        // Lấy tên chủ hộ từ danh sách residents đã load sẵn (tránh N+1 query)
        String headOfHouseholdName = null;
        Integer memberCount = 0;
        
        if (entity.getResidents() != null) {
            List<ResidentsEntity> residents = entity.getResidents();
            memberCount = residents.size();
            
            // Tìm chủ hộ trong danh sách residents
            if (entity.getHeadOfHousehold() != null) {
                headOfHouseholdName = residents.stream()
                    .filter(r -> r.getResidentId().equals(entity.getHeadOfHousehold()))
                    .findFirst()
                    .map(ResidentsEntity::getFullName)
                    .orElse(null);
            }
        }
        
        // Lấy số phòng từ apartment
        String apartmentNumber = null;
        if (entity.getApartment() != null && entity.getApartment().getRoomNumber() != null) {
            apartmentNumber = entity.getApartment().getRoomNumber().toString();
        }
        
        // Map members
        List<MemberResponse> memberResponses = null;
        if (entity.getResidents() != null) {
            memberResponses = entity.getResidents().stream()
                .map(resident -> MemberResponse.builder()
                    .residentId(resident.getResidentId())
                    .fullName(resident.getFullName())
                    .idNumber(resident.getIdNumber())
                    .familyRole(resident.getFamilyRole())
                    .dateOfBirth(resident.getDateOfBirth())
                    .gender(resident.getGender())
                    .phoneNumber(resident.getPhoneNumber())
                    .job(resident.getJob())
                    .build())
                .collect(Collectors.toList());
        }

        return HouseholdResponse.builder()
                .householdId(entity.getHouseholdId())
                .headOfHouseholdName(headOfHouseholdName)
                .memberCount(memberCount)
                .startDay(entity.getStartDay())
                .status(entity.getStatus())
                .apartment(apartmentNumber)
                .members(memberResponses)
                .build();
    }

    public List<HouseholdResponse> toHouseholdResponses(List<HouseholdEntity> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(this::toHouseholdResponse)
                .collect(Collectors.toList());
    }
}
