package BlueMoon.example.BlueMoon.mapper;

import BlueMoon.example.BlueMoon.dto.request.ResidentAddRequest;
import BlueMoon.example.BlueMoon.dto.response.ResidentResponse;
import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResidentMapper {

    @Mapping(source = "household.householdId", target = "householdId")
    List<ResidentResponse> toResidentSelectResponses(List<ResidentsEntity> residents);
    
    ResidentsEntity toResidentEntity(ResidentAddRequest request);
    
    @Mapping(source = "household.householdId", target = "householdId")
    ResidentResponse toResidentSelectResponse(ResidentsEntity request);

    void updateResidentFromRequest(ResidentAddRequest request, @MappingTarget ResidentsEntity resident);
}
