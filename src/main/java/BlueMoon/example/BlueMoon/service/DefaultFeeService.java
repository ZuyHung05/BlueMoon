package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.DefaultFeeUpdateRequest;
import BlueMoon.example.BlueMoon.dto.response.DefaultFeeResponse;
import BlueMoon.example.BlueMoon.entity.DefaultFee;
import BlueMoon.example.BlueMoon.exception.AppException;

import BlueMoon.example.BlueMoon.repository.DefaultFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DefaultFeeService {

    @Autowired
    private DefaultFeeRepository defaultFeeRepository;

    public List<DefaultFeeResponse> getAllDefaultFees() {
        return defaultFeeRepository.findAll().stream()
                .map(fee -> DefaultFeeResponse.builder()
                        .id(fee.getId())
                        .description(fee.getDescription().name())
                        .descriptionVi(fee.getDescription().getVietnameseDescription())
                        .unitPrice(fee.getUnitPrice())
                        .build())
                .collect(Collectors.toList());
    }

    public DefaultFeeResponse updateDefaultFee(Integer id, DefaultFeeUpdateRequest request) {
        DefaultFee fee = defaultFeeRepository.findById(id)
                .orElseThrow(() -> new AppException("Fee not found"));

        if (request.getUnitPrice() != null) {
            fee.setUnitPrice(request.getUnitPrice());
        }

        DefaultFee updatedFee = defaultFeeRepository.save(fee);

        return DefaultFeeResponse.builder()
                .id(updatedFee.getId())
                .description(updatedFee.getDescription().name())
                .descriptionVi(updatedFee.getDescription().getVietnameseDescription())
                .unitPrice(updatedFee.getUnitPrice())
                .build();
    }
}
