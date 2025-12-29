package BlueMoon.example.BlueMoon.controller;

import BlueMoon.example.BlueMoon.dto.ApiResponse;
import BlueMoon.example.BlueMoon.dto.request.PaymentPeriodRequest;
import BlueMoon.example.BlueMoon.dto.response.PaymentPeriodResponse;
import BlueMoon.example.BlueMoon.service.PaymentPeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-periods")
public class PaymentPeriodController {

    @Autowired
    private PaymentPeriodService paymentPeriodService;

    @PostMapping
    public ApiResponse<PaymentPeriodResponse> createPaymentPeriod(@RequestBody PaymentPeriodRequest request) {
        return ApiResponse.<PaymentPeriodResponse>builder()
                .result(paymentPeriodService.createPaymentPeriod(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PaymentPeriodResponse>> getAllPaymentPeriods() {
        return ApiResponse.<List<PaymentPeriodResponse>>builder()
                .result(paymentPeriodService.getAllPaymentPeriods())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PaymentPeriodResponse> updatePaymentPeriod(@PathVariable Long id, @RequestBody PaymentPeriodRequest request) {
        return ApiResponse.<PaymentPeriodResponse>builder()
                .result(paymentPeriodService.updatePaymentPeriod(id, request))
                .build();
    }

    @GetMapping("/{id}/details")
    public ApiResponse<List<BlueMoon.example.BlueMoon.dto.response.PaymentPeriodDetailResponse>> getPaymentPeriodDetails(@PathVariable Long id) {
        return ApiResponse.<List<BlueMoon.example.BlueMoon.dto.response.PaymentPeriodDetailResponse>>builder()
                .result(paymentPeriodService.getPaymentPeriodDetails(id))
                .build();
    }

    @PostMapping("/{id}/pay")
    public ApiResponse<String> addPayment(@PathVariable Long id, @RequestBody BlueMoon.example.BlueMoon.dto.request.PaymentRequest request) {
        paymentPeriodService.addPayment(id, request);
        return ApiResponse.<String>builder()
                .result("Payment recorded successfully")
                .build();
    }
}
