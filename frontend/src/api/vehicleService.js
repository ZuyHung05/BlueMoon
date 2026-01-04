import api from './axios';

/**
 * Vehicle Service - API calls for Vehicle management
 */

// Lấy tất cả phương tiện
export const getAllVehicles = async () => {
    const response = await api.get('/api/vehicles');
    return response.data;
};

// Lấy phương tiện theo ID
export const getVehicleById = async (vehicleId) => {
    const response = await api.get(`/api/vehicles/${vehicleId}`);
    return response.data;
};

// Tìm kiếm phương tiện
export const searchVehicles = async (params) => {
    const response = await api.get('/api/vehicles/search', { params });
    return response.data;
};

// Thêm phương tiện mới
export const addVehicle = async (vehicleData) => {
    const response = await api.post('/api/vehicles', vehicleData);
    return response.data;
};

// Cập nhật phương tiện
export const updateVehicle = async (vehicleId, vehicleData) => {
    const response = await api.put(`/api/vehicles/${vehicleId}`, vehicleData);
    return response.data;
};

// Xóa phương tiện
export const deleteVehicle = async (vehicleId) => {
    const response = await api.delete(`/api/vehicles/${vehicleId}`);
    return response.data;
};

export default {
    getAllVehicles,
    getVehicleById,
    searchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
};
