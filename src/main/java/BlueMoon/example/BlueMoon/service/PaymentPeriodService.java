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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.time.LocalDate;

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
        entity.setCount(0); // Initialize count

        PaymentPeriodEntity saved = paymentPeriodRepository.save(entity);
        java.util.Set<Long> validIds = householdRepository.findAll().stream().map(BlueMoon.example.BlueMoon.entity.HouseholdEntity::getHouseholdId).collect(Collectors.toSet());
        return mapToResponse(saved, validIds);
    }

    @Transactional(readOnly = true)
    public List<PaymentPeriodResponse> getAllPaymentPeriods() {
        java.util.Set<Long> validIds = householdRepository.findAll().stream().map(BlueMoon.example.BlueMoon.entity.HouseholdEntity::getHouseholdId).collect(Collectors.toSet());
        return paymentPeriodRepository.findAll().stream()
                .map(entity -> {
                    PaymentPeriodResponse response = mapToResponse(entity, validIds);
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
        java.util.Set<Long> validIds = householdRepository.findAll().stream().map(BlueMoon.example.BlueMoon.entity.HouseholdEntity::getHouseholdId).collect(Collectors.toSet());
        return mapToResponse(updated, validIds);
    }

    private PaymentPeriodResponse mapToResponse(PaymentPeriodEntity entity, java.util.Set<Long> validHouseholdIds) {
        long totalHouseholds;
        

        
        if (Boolean.TRUE.equals(entity.getIsMandatory())) {
            if (entity.getFees() != null && !entity.getFees().isEmpty()) {
                totalHouseholds = entity.getFees().stream()
                        .filter(f -> f.getHousehold() != null && validHouseholdIds.contains(f.getHousehold().getHouseholdId()))
                        .map(f -> f.getHousehold().getHouseholdId())
                        .distinct()
                        .count();
            } else {
                totalHouseholds = householdRepository.countByStatus("1");
            }
        } else {
            totalHouseholds = householdRepository.countByStatus("1");
        }

        List<PayEntity> validPayments = (entity.getPays() != null) 
                ? entity.getPays().stream()
                    .filter(p -> p.getPayDate() != null && p.getAmount().compareTo(BigDecimal.ZERO) > 0 && p.getHousehold() != null)
                    .filter(p -> validHouseholdIds.contains(p.getHousehold().getHouseholdId()))
                    .collect(Collectors.toMap(
                        p -> p.getHousehold().getHouseholdId(), // Key by Household ID
                        p -> p, // Keep the payment entity
                        (existing, replacement) -> replacement // If duplicate, keep latest
                    ))
                    .values().stream()
                    .collect(Collectors.toList())
                : List.of();

        long paidCount = validPayments.size();
        
        BigDecimal collectedAmount = validPayments.stream()
                .map(PayEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
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

        Map<Long, BigDecimal> feeMap = new java.util.HashMap<>();
        Map<Long, List<BlueMoon.example.BlueMoon.dto.response.FeeDetailResponse>> detailsMap = new java.util.HashMap<>();

        if (period.getFees() != null) {
            for (FeesEntity fee : period.getFees()) {
                Long hhId = fee.getHousehold().getHouseholdId();
                BigDecimal price = fee.getUnitPrice() != null ? fee.getUnitPrice() : BigDecimal.ZERO;
                
                // Calculate amount based on unit * unitPrice
                BigDecimal quantity = BigDecimal.ONE;
                if (fee.getUnit() != null) {
                    try {
                        String val = fee.getUnit().trim().split("\\s+")[0];
                        quantity = new BigDecimal(val);
                    } catch (Exception e) {
                        quantity = BigDecimal.ZERO;
                    }
                }
                
                BigDecimal totalItemFee = price.multiply(quantity);
                feeMap.put(hhId, feeMap.getOrDefault(hhId, BigDecimal.ZERO).add(totalItemFee));
                
                // Add to details list
                detailsMap.computeIfAbsent(hhId, k -> new java.util.ArrayList<>()).add(
                    BlueMoon.example.BlueMoon.dto.response.FeeDetailResponse.builder()
                        .feeId(fee.getFeesId())
                        .description(fee.getDescription())
                        .unit(fee.getUnit())
                        .unitPrice(fee.getUnitPrice())
                        .quantity(quantity)
                        .amount(totalItemFee)
                        .build()
                );
            }
        }

        return households.stream().map(hh -> {
            PayEntity pay = payMap.get(hh.getHouseholdId());
            BigDecimal requiredAmount = feeMap.getOrDefault(hh.getHouseholdId(), BigDecimal.ZERO);
            
            if ("0".equals(hh.getStatus()) && requiredAmount.compareTo(BigDecimal.ZERO) == 0 && pay == null) {
                return null;
            }

            BigDecimal paidAmount = (pay != null) ? pay.getAmount() : BigDecimal.ZERO;
            String status = (pay != null && pay.getPayDate() != null && pay.getAmount().compareTo(BigDecimal.ZERO) > 0) ? "Paid" : "Unpaid";
            
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
                    .feeDetails(detailsMap.getOrDefault(hh.getHouseholdId(), java.util.Collections.emptyList()))
                    .build();
        })
        .filter(response -> response != null)
        .collect(Collectors.toList());
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
    @Autowired
    private BlueMoon.example.BlueMoon.repository.FeesRepository feesRepository;

    public void deletePaymentPeriod(Long id) {
        if (!paymentPeriodRepository.existsById(id)) {
            throw new AppException("Payment period not found");
        }
        
        // Explicitly delete children first to avoid constraint validation
        feesRepository.deleteByPaymentPeriodId(id);
        payRepository.deleteByPaymentPeriodId(id);

        paymentPeriodRepository.deleteById(id);
    }
    
    public String debugPaymentPeriod(Long id) {
        StringBuilder sb = new StringBuilder();
        
        PaymentPeriodEntity period = paymentPeriodRepository.findById(id).orElse(null);
        if (period == null) return "Period not found";
        
        java.util.Set<Long> validHouseholdIds = householdRepository.findAll().stream()
                .map(BlueMoon.example.BlueMoon.entity.HouseholdEntity::getHouseholdId)
                .collect(Collectors.toSet());
        
        sb.append("Valid Household IDs count: ").append(validHouseholdIds.size()).append("\n");
        sb.append("Valid Household IDs: ").append(validHouseholdIds).append("\n");
        
        if (period.getPays() == null) {
            sb.append("Pays list is null\n");
            return sb.toString();
        }
        
        sb.append("Total Raw Payments: ").append(period.getPays().size()).append("\n");
        
        BigDecimal sum = BigDecimal.ZERO;
        
        for (PayEntity p : period.getPays()) {
            sb.append("Payment: Household=").append(p.getHousehold() != null ? p.getHousehold().getHouseholdId() : "NULL");
            sb.append(", Amount=").append(p.getAmount());
            sb.append(", Date=").append(p.getPayDate());
            
            BigDecimal required = BigDecimal.ZERO;
            try {
                if (period.getFees() != null) {
                     required = period.getFees().stream()
                         .filter(f -> f.getHousehold() != null && p.getHousehold() != null && f.getHousehold().getHouseholdId().equals(p.getHousehold().getHouseholdId()))
                         .map(f -> {
                             try {
                                 BigDecimal unit = (f.getUnit() != null && !f.getUnit().isEmpty()) ? new BigDecimal(f.getUnit()) : BigDecimal.ZERO;
                                 return f.getUnitPrice().multiply(unit);
                             } catch (Exception e) {
                                 return BigDecimal.ZERO;
                             }
                         })
                         .findFirst()
                         .orElse(BigDecimal.ZERO);
                }
            } catch (Exception e) {
                sb.append(" [FeeError]");
            }
            sb.append(", Required=").append(required);
            
            boolean isValidHousehold = p.getHousehold() != null && validHouseholdIds.contains(p.getHousehold().getHouseholdId());
            boolean isAmountPositive = p.getAmount() != null && p.getAmount().compareTo(BigDecimal.ZERO) > 0;
            boolean isDatePresent = p.getPayDate() != null;
            
            sb.append(" -> ValidHH=").append(isValidHousehold);
            sb.append(", PosAmt=").append(isAmountPositive);
            sb.append(", DateOK=").append(isDatePresent);
            
            if (isValidHousehold && isAmountPositive && isDatePresent) {
                sb.append(" [INCLUDED]");
                sum = sum.add(p.getAmount());
            } else {
                sb.append(" [EXCLUDED]");
            }
            sb.append("\n");
        }
        
        sb.append("Calculated Sum: ").append(sum).append("\n");
        
        return sb.toString();
    }
    @Transactional(readOnly = true)
    public List<BlueMoon.example.BlueMoon.dto.response.UnpaidFeeResponse> getUnpaidFeesByHousehold(Long householdId) {
        BlueMoon.example.BlueMoon.entity.HouseholdEntity household = householdRepository.findById(householdId)
                .orElseThrow(() -> new AppException("Household not found"));

        List<PaymentPeriodEntity> periods = paymentPeriodRepository.findAll();
        
        return periods.stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsMandatory()))
                .filter(p -> {
                    // Check if paid
                    if (p.getPays() == null) return true;
                    return p.getPays().stream()
                            .noneMatch(pay -> pay.getHousehold().getHouseholdId().equals(householdId) && 
                                              pay.getPayDate() != null && 
                                              pay.getAmount().compareTo(BigDecimal.ZERO) > 0);
                })
                .map(period -> {
                    // Calculate required amount
                    BigDecimal totalAmount = BigDecimal.ZERO;
                    List<BlueMoon.example.BlueMoon.dto.response.FeeDetailResponse> feeDetails = new java.util.ArrayList<>();
                    
                    if (period.getFees() != null) {
                        for (FeesEntity fee : period.getFees()) {
                            if (fee.getHousehold().getHouseholdId().equals(householdId)) {
                                BigDecimal price = fee.getUnitPrice() != null ? fee.getUnitPrice() : BigDecimal.ZERO;
                                BigDecimal quantity = BigDecimal.ONE;
                                if (fee.getUnit() != null) {
                                    try {
                                        String val = fee.getUnit().trim().split("\\s+")[0];
                                        quantity = new BigDecimal(val);
                                    } catch (Exception e) {
                                        quantity = BigDecimal.ZERO;
                                    }
                                }
                                BigDecimal itemTotal = price.multiply(quantity);
                                totalAmount = totalAmount.add(itemTotal);
                                
                                feeDetails.add(BlueMoon.example.BlueMoon.dto.response.FeeDetailResponse.builder()
                                        .description(fee.getDescription())
                                        .unit(fee.getUnit())
                                        .unitPrice(fee.getUnitPrice())
                                        .quantity(quantity)
                                        .amount(itemTotal)
                                        .build());
                            }
                        }
                    }
                    
                    if (totalAmount.compareTo(BigDecimal.ZERO) == 0) return null;

                    return BlueMoon.example.BlueMoon.dto.response.UnpaidFeeResponse.builder()
                            .paymentPeriodId(period.getPaymentPeriodId())
                            .paymentPeriodName(period.getDescription())
                            .startDate(period.getStartDate())
                            .endDate(period.getEndDate())
                            .amount(totalAmount)
                            .feeDetails(feeDetails)
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }
    @Transactional
    public void importPaymentData(MultipartFile file, String description, LocalDate startDate, LocalDate endDate, Boolean isMandatory, Long paymentPeriodId) {
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            
            // Map Room (Long) -> Household
            Map<Long, BlueMoon.example.BlueMoon.entity.HouseholdEntity> roomToHousehold = householdRepository.findAll().stream()
                .filter(h -> "1".equals(h.getStatus())) // Only active households
                .filter(h -> h.getApartment() != null && h.getApartment().getRoomNumber() != null)
                .collect(Collectors.toMap(
                    h -> h.getApartment().getRoomNumber(),
                    h -> h,
                    (existing, replacement) -> existing
                ));
            
            // Create or Update Payment Period
            PaymentPeriodEntity period;
            
            if (paymentPeriodId != null) {
                // Precise update by ID 
                period = paymentPeriodRepository.findById(paymentPeriodId)
                    .orElseThrow(() -> new RuntimeException("Payment Period ID " + paymentPeriodId + " not found."));
            } else {
                // Legacy fallback: Lookup by description (risk of merging)
                period = paymentPeriodRepository.findByDescription(description)
                    .orElse(new PaymentPeriodEntity());
            }

            if (period.getPaymentPeriodId() == null) {
                period.setDescription(description);
                period.setCount(0); // Initialize count
            }
            
            // Always update dates and type based on user input
            period.setStartDate(startDate);
            period.setEndDate(endDate);
            period.setIsMandatory(isMandatory);
            
            period = paymentPeriodRepository.saveAndFlush(period);
            
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header

                Double aptVal = getNumericValue(row.getCell(0)); // Ma_Can_Ho
                
                if (aptVal == null) continue;
                
                Long roomNum = aptVal.longValue();
                BlueMoon.example.BlueMoon.entity.HouseholdEntity household = roomToHousehold.get(roomNum);
                
                if (household == null) {
                    System.out.println("Skipping row: Household not found for room " + roomNum);
                    continue; 
                }

                // Extract Data
                Double elecVal = getNumericValue(row.getCell(2)); // kWh
                Double elecCoeff = getNumericValue(row.getCell(3));
                Double waterVal = getNumericValue(row.getCell(4)); // m3
                Double waterCoeff = getNumericValue(row.getCell(5));
                Double internetVal = getNumericValue(row.getCell(6)); // Amount

                // Create Fees
                createFeeIfPresent(period, household, "Tiền điện", elecVal, elecCoeff, "kWh");
                createFeeIfPresent(period, household, "Tiền nước", waterVal, waterCoeff, "m3");
                
                if (internetVal != null && internetVal > 0) {
                     saveFee(period, household, "Tiền Internet", BigDecimal.ONE, new BigDecimal(internetVal), "Gói");
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log for debug
            throw new AppException("Import failed: " + e.getMessage());
        }
    }
    
    private void createFeeIfPresent(PaymentPeriodEntity period, BlueMoon.example.BlueMoon.entity.HouseholdEntity household, String name, Double val, Double coeff, String unit) {
        if (val != null && val > 0 && coeff != null) {
            // Assume Coeff is Price in Thousands? Or Raw?
            // Mock says 2.5. Let's assume it implies 2500 per unit.
            BigDecimal quantity = new BigDecimal(val);
            BigDecimal unitPrice = new BigDecimal(coeff * 1000); 
            saveFee(period, household, name, quantity, unitPrice, unit);
        }
    }
    
    private void saveFee(PaymentPeriodEntity period, BlueMoon.example.BlueMoon.entity.HouseholdEntity household, String name, BigDecimal quantity, BigDecimal unitPrice, String unit) {
        FeesEntity fee = new FeesEntity();
        fee.setPaymentPeriod(period);
        fee.setHousehold(household);
        fee.setDescription(name);
        fee.setUnitPrice(unitPrice);
        fee.setUnit(quantity + " " + unit);
        
        feesRepository.save(fee);
    }

    private Double getNumericValue(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) return cell.getNumericCellValue();
        if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue());
            } catch (Exception e) { return null; }
        }
        return null;
    }


    public void updateFee(Long feeId, Double quantity, BigDecimal unitPrice) {
        FeesEntity fee = feesRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        if (unitPrice != null) {
            fee.setUnitPrice(unitPrice);
        }

        if (quantity != null && fee.getUnit() != null) {
            String currentUnit = fee.getUnit().trim();
            // Extract suffix (remove leading number)
            String suffix = currentUnit.replaceFirst("^[0-9.]+\\s*", "");
            if (suffix.isEmpty()) suffix = currentUnit; // Fallback

            // Format quantity
            String qtyStr = (quantity % 1 == 0) ? String.valueOf(quantity.longValue()) : String.valueOf(quantity);
            fee.setUnit(qtyStr + " " + suffix);
        }
        
        feesRepository.save(fee);
    }
}
