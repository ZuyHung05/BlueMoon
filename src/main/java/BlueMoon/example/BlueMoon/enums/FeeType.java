package BlueMoon.example.BlueMoon.enums;

public enum FeeType {
    APARTMENT_SERVICE_FEE("Phí dịch vụ chung cư"),
    APARTMENT_MANAGEMENT_FEE("Phí quản lý chung cư"),
    MOTORBIKE_PARKING_FEE("Phí gửi xe máy"),
    CAR_PARKING_FEE("Phí gửi ô tô");

    private final String vietnameseDescription;

    FeeType(String vietnameseDescription) {
        this.vietnameseDescription = vietnameseDescription;
    }

    public String getVietnameseDescription() {
        return vietnameseDescription;
    }
}
