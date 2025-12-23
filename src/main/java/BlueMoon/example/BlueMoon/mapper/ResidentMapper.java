package BlueMoon.example.BlueMoon.mapper;

import BlueMoon.example.BlueMoon.dto.request.ResidentAddRequest;
import BlueMoon.example.BlueMoon.dto.response.ResidentResponse;
import BlueMoon.example.BlueMoon.entity.ResidentsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResidentMapper {

    List<ResidentResponse> toResidentSelectResponses(List<ResidentsEntity> residents);
    ResidentsEntity toResidentEntity(ResidentAddRequest request);
    ResidentResponse toResidentSelectResponse(ResidentsEntity request);

    void updateResidentFromRequest(ResidentAddRequest request, @MappingTarget ResidentsEntity resident);
}
