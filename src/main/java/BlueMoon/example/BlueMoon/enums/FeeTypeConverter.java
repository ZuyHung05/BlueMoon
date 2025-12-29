package BlueMoon.example.BlueMoon.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FeeTypeConverter implements AttributeConverter<FeeType, String> {

    @Override
    public String convertToDatabaseColumn(FeeType feeType) {
        if (feeType == null) {
            return null;
        }
        return feeType.name().toLowerCase();
    }

    @Override
    public FeeType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return FeeType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Fallback or handle typo
            System.err.println("Unknown FeeType: " + dbData);
            return null; 
        }
    }
}
