package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.PaymentPeriodRequest;
import BlueMoon.example.BlueMoon.dto.response.PaymentPeriodResponse;
import BlueMoon.example.BlueMoon.entity.PaymentPeriodEntity;
import BlueMoon.example.BlueMoon.entity.FeesEntity;
import BlueMoon.example.BlueMoon.entity.PayEntity;
import BlueMoon.example.BlueMoon.exception.AppException;
import BlueMoon.example.BlueMoon.repository.HouseholdRepository;
import BlueMoon.example.BlueMoon.repository.PaymentPeriodRepository;
import BlueMoon.example.BlueMoon.repository.PayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentPeriodService {

    @Autowired
    private PaymentPeriodRepository paymentPeriodRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private PayRepository payRepository;

    public PaymentPeriodResponse createPaymentPeriod(PaymentPeriodRequest request) {
        PaymentPeriodEntity entity = new PaymentPeriodEntity();
        entity.setDescription(request.getDescription());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setIsMandatory(request.getIsMandatory());
        entity.setCount(0L); // Initialize count

        PaymentPeriodEntity saved = paymentPeriodRepository.save(entity);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PaymentPeriodResponse> getAllPaymentPeriods() {
        long totalHouseholds = householdRepository.count();
        return paymentPeriodRepository.findAll().stream()
                .map(entity -> {
                    PaymentPeriodResponse response = mapToResponse(entity);
                    response.setTotal(totalHouseholds);
                    // Calculates paid count based on PayEntity list size if available, otherwise 0
                    if (entity.getPays() != null) {
                        response.setCount((long) entity.getPays().size());
                    } else {
                        response.setCount(0L);
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    public PaymentPeriodResponse updatePaymentPeriod(Long id, PaymentPeriodRequest request) {
        PaymentPeriodEntity entity = paymentPeriodRepository.findById(id)
                .orElseThrow(() -> new AppException("Payment period not found"));

        entity.setDescription(request.getDescription());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setIsMandatory(request.getIsMandatory());

        PaymentPeriodEntity updated = paymentPeriodRepository.save(entity);
        return mapToResponse(updated);
    }

    private PaymentPeriodResponse mapToResponse(PaymentPeriodEntity entity) {
        long totalHouseholds = householdRepository.count();
        long paidCount = (entity.getPays() != null) ? entity.getPays().size() : 0;
        BigDecimal collectedAmount = (entity.getPays() != null) 
                ? entity.getPays().stream()
                    .map(PayEntity::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                : BigDecimal.ZERO;
        
        return PaymentPeriodResponse.builder()
                .paymentPeriodId(entity.getPaymentPeriodId())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .isMandatory(entity.getIsMandatory())
                .count(paidCount)
                .total(totalHouseholds)
                .collectedAmount(collectedAmount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<BlueMoon.example.BlueMoon.dto.response.PaymentPeriodDetailResponse> getPaymentPeriodDetails(Long id) {
        PaymentPeriodEntity period = paymentPeriodRepository.findById(id)
                .orElseThrow(() -> new AppException("Payment period not found"));

        List<BlueMoon.example.BlueMoon.entity.HouseholdEntity> households = householdRepository.findAll();
        
        // Cache payments for lookup
        Map<Long, PayEntity> payMap = new java.util.HashMap<>();
        if (period.getPays() != null) {
            for (PayEntity pay : period.getPays()) {
                payMap.put(pay.getHousehold().getHouseholdId(), pay);
            }
        }

        // Cache fees: Group by household and sum unitPrice
        // Note: unitPrice in DB might be null. Treat null as ZERO.
        Map<Long, BigDecimal> feeMap = new java.util.HashMap<>();
        if (period.getFees() != null) {
            for (FeesEntity fee : period.getFees()) {
                Long hhId = fee.getHousehold().getHouseholdId();
                BigDecimal price = fee.getUnitPrice() != null ? fee.getUnitPrice() : BigDecimal.ZERO;
                feeMap.put(hhId, feeMap.getOrDefault(hhId, BigDecimal.ZERO).add(price));
            }
        }

        return households.stream().map(hh -> {
            PayEntity pay = payMap.get(hh.getHouseholdId());
            BigDecimal requiredAmount = feeMap.getOrDefault(hh.getHouseholdId(), BigDecimal.ZERO);
            BigDecimal paidAmount = (pay != null) ? pay.getAmount() : BigDecimal.ZERO;
            String status = (pay != null) ? "Paid" : "Unpaid";
            
            // Get Room
            String room = (hh.getApartment() != null) ? String.valueOf(hh.getApartment().getRoomNumber()) : "N/A";

            // Get Name
            String name = "Unknown";
            if (hh.getResidents() != null) {
                for (BlueMoon.example.BlueMoon.entity.ResidentsEntity res : hh.getResidents()) {
                    if (res.getResidentId().equals(hh.getHeadOfHousehold())) {
                        name = res.getFullName();
                        break;
                    }
                }
            }
            
            return BlueMoon.example.BlueMoon.dto.response.PaymentPeriodDetailResponse.builder()
                    .householdId(hh.getHouseholdId())
                    .householdName(name)
                    .room(room)
                    .requiredAmount(requiredAmount)
                    .paidAmount(paidAmount)
                    .status(status)
                    .paidDate((pay != null) ? pay.getPayDate() : null)
                    .method((pay != null) ? pay.getMethod() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    public void addPayment(Long paymentPeriodId, BlueMoon.example.BlueMoon.dto.request.PaymentRequest request) {
        PaymentPeriodEntity period = paymentPeriodRepository.findById(paymentPeriodId)
                .orElseThrow(() -> new AppException("Payment period not found"));
        
        BlueMoon.example.BlueMoon.entity.HouseholdEntity household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new AppException("Household not found"));

        PayEntity pay = new PayEntity();
        
        BlueMoon.example.BlueMoon.serializable.PayId payId = new BlueMoon.example.BlueMoon.serializable.PayId(request.getHouseholdId(), paymentPeriodId);
        pay.setId(payId);
        
        pay.setHousehold(household);
        pay.setPaymentPeriod(period);
        pay.setAmount(request.getAmount());
        pay.setMethod(request.getMethod());
        pay.setPayDate(java.time.LocalDateTime.now());
        
        payRepository.save(pay);
    }
}
