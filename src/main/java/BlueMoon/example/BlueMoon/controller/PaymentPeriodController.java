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
    @DeleteMapping("/{id}")
    public ApiResponse<String> deletePaymentPeriod(@PathVariable Long id) {
        paymentPeriodService.deletePaymentPeriod(id);
        return ApiResponse.<String>builder()
                .result("Payment period deleted successfully")
                .build();
    }
    @GetMapping("/{id}/debug")
    public String debugPaymentPeriod(@PathVariable Long id) {
        return paymentPeriodService.debugPaymentPeriod(id);
    }
    @PostMapping("/import")
    public ApiResponse<String> importPaymentData(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("startDate") java.time.LocalDate startDate,
            @RequestParam("endDate") java.time.LocalDate endDate,
            @RequestParam("isMandatory") Boolean isMandatory,
            @RequestParam(value = "paymentPeriodId", required = false) Long paymentPeriodId
    ) {
        if (file == null || file.isEmpty()) {
             throw new RuntimeException("File is empty");
        }
        paymentPeriodService.importPaymentData(file, description, startDate, endDate, isMandatory, paymentPeriodId);
        return ApiResponse.<String>builder()
                .result("Import successful")
                .build();
    }

    @GetMapping("/unpaid/{householdId}")
    public ApiResponse<List<BlueMoon.example.BlueMoon.dto.response.UnpaidFeeResponse>> getUnpaidFees(@PathVariable Long householdId) {
        return ApiResponse.<List<BlueMoon.example.BlueMoon.dto.response.UnpaidFeeResponse>>builder()
                .result(paymentPeriodService.getUnpaidFeesByHousehold(householdId))
                .build();
    }
    @PutMapping("/fees/{id}")
    public ApiResponse<String> updateFee(@PathVariable Long id, @RequestBody java.util.Map<String, Object> body) {
        Double quantity = body.get("quantity") != null ? Double.valueOf(body.get("quantity").toString()) : null;
        java.math.BigDecimal unitPrice = body.get("unitPrice") != null ? new java.math.BigDecimal(body.get("unitPrice").toString()) : null;
        
        paymentPeriodService.updateFee(id, quantity, unitPrice);
        return ApiResponse.<String>builder().result("Updated successfully").build();
    }
}
