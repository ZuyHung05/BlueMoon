import axios from './axios';

/**
 * Lấy thống kê cho Fee Dashboard
 */
export const getFeeStats = async () => {
    try {
        const response = await axios.get('/api/dashboard/fee-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching fee stats:', error);
        throw error;
    }
};

/**
 * Lấy thống kê cho Resident Dashboard
 */
export const getResidentStats = async () => {
    try {
        const response = await axios.get('/api/dashboard/resident-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching resident stats:', error);
        throw error;
    }
};

export default {
    getFeeStats,
    getResidentStats
};
