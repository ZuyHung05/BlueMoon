package BlueMoon.example.BlueMoon.controller;

import BlueMoon.example.BlueMoon.dto.ApiResponse;
import BlueMoon.example.BlueMoon.dto.request.DefaultFeeUpdateRequest;
import BlueMoon.example.BlueMoon.dto.response.DefaultFeeResponse;
import BlueMoon.example.BlueMoon.service.DefaultFeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/default-fee")
public class DefaultFeeController {

    @Autowired
    private DefaultFeeService defaultFeeService;

    @GetMapping
    public ApiResponse<List<DefaultFeeResponse>> getAllDefaultFees() {
        return ApiResponse.<List<DefaultFeeResponse>>builder()
                .result(defaultFeeService.getAllDefaultFees())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DefaultFeeResponse> updateDefaultFee(@PathVariable Integer id, @RequestBody DefaultFeeUpdateRequest request) {
        return ApiResponse.<DefaultFeeResponse>builder()
                .result(defaultFeeService.updateDefaultFee(id, request))
                .build();
    }
}
