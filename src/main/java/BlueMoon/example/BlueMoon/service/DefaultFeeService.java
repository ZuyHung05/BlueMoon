package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.DefaultFeeUpdateRequest;
import BlueMoon.example.BlueMoon.dto.response.DefaultFeeResponse;
import BlueMoon.example.BlueMoon.entity.DefaultFee;
import BlueMoon.example.BlueMoon.enums.FeeType;
import BlueMoon.example.BlueMoon.exception.AppException;

import BlueMoon.example.BlueMoon.repository.DefaultFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DefaultFeeService {

    @Autowired
    private DefaultFeeRepository defaultFeeRepository;

    public List<DefaultFeeResponse> getAllDefaultFees() {
        return defaultFeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DefaultFeeResponse updateDefaultFee(Integer id, DefaultFeeUpdateRequest request) {
        DefaultFee fee = defaultFeeRepository.findById(id)
                .orElseThrow(() -> new AppException("Fee not found"));

        if (request.getUnitPrice() != null) {
            fee.setUnitPrice(BigDecimal.valueOf(request.getUnitPrice()));
        }

        DefaultFee updatedFee = defaultFeeRepository.save(fee);

        return mapToResponse(updatedFee);
    }

    private DefaultFeeResponse mapToResponse(DefaultFee fee) {
        String descriptionVi = fee.getDescription(); // Default to description if enum not found
        try {
            if (fee.getDescription() != null) {
                FeeType type = FeeType.valueOf(fee.getDescription().toUpperCase());
                descriptionVi = type.getVietnameseDescription();
            }
        } catch (IllegalArgumentException e) {
            // Ignore, usage raw string
        }

        return DefaultFeeResponse.builder()
                .id(fee.getId())
                .description(fee.getDescription())
                .descriptionVi(descriptionVi)
                .unitPrice(fee.getUnitPrice() != null ? fee.getUnitPrice().doubleValue() : 0.0)
                .build();
    }
}
