// Utility function to translate fee descriptions from English to Vietnamese
export const translateFeeDescription = (description) => {
    if (!description) return '';

    // Handle exact matches first
    const translationMap = {
        'building_fee': 'Phí quản lý dịch vụ chung cư',
        'apartment_service_fee': 'Phí dịch vụ chung cư',
        'apartment_management_fee': 'Phí quản lý chung cư',
        'motorbike_parking_fee': 'Phí gửi xe máy',
        'car_parking_fee': 'Phí gửi ô tô',
        'Phí quản lý': 'Phí quản lý',
        'Phí gửi xe': 'Phí gửi xe',
        'Phí dịch vụ': 'Phí dịch vụ',
        'Phí điện nước': 'Phí điện nước',
        'Phí bảo trì': 'Phí bảo trì'
    };

    if (translationMap[description]) {
        return translationMap[description];
    }

    // Handle dynamic strings (e.g., from triggers or user input)
    let translated = description;
    translated = translated.replace('Service Fee', 'Phí dịch vụ');
    translated = translated.replace('Management Fee', 'Phí quản lý');
    translated = translated.replace('Motorbike Parking Fee', 'Phí gửi xe máy');
    translated = translated.replace('Car Parking Fee', 'Phí gửi ô tô');
    translated = translated.replace('Electric Fee', 'Phí điện');
    translated = translated.replace('Water Fee', 'Phí nước');

    return translated;
};

// Utility function to format Vietnamese fee names consistently
export const formatFeeName = (description) => {
    const translated = translateFeeDescription(description);
    // Capitalize first letter if needed
    return translated.charAt(0).toUpperCase() + translated.slice(1);
};
