import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';

const AddVehicleFormInline = ({ selectedSlot, currentFloor, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        roomNumber: '',
        plateNumber: '',
        type: selectedSlot?.type || 'bike',
        basementFloor: currentFloor || 1,
        location: selectedSlot?.slotId || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.roomNumber) {
            setError('Vui lòng nhập số phòng!');
            return;
        }
        if (!formData.plateNumber) {
            setError('Vui lòng nhập biển số xe!');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Convert to numbers before sending
            const dataToSend = {
                ...formData,
                roomNumber: parseInt(formData.roomNumber),
                basementFloor: parseInt(formData.basementFloor)
            };

            console.log('Sending data from AddVehicleFormInline:', dataToSend);

            const { addVehicle } = await import('api/vehicleService');
            const response = await addVehicle(dataToSend);

            if (response.success) {
                onSuccess();
            } else {
                setError(response.message || 'Thêm xe thất bại!');
            }
        } catch (err) {
            console.error('Error adding vehicle:', err);
            let errorMessage = 'Có lỗi xảy ra!';

            if (err.response?.data) {
                const data = err.response.data;
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors) {
                    if (Array.isArray(data.errors)) {
                        errorMessage = data.errors.join(', ');
                    } else if (typeof data.errors === 'object') {
                        errorMessage = Object.values(data.errors).join(', ');
                    }
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2.5} sx={{ mt: 1 }}>
            {error && (
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Box>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                    Số phòng <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    type="number"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    size="small"
                    placeholder="Nhập số phòng"
                />
            </Box>

            <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                        Biển số xe <span style={{ color: '#ef4444' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="VD: 30A-12345"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleChange}
                        size="small"
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                        Loại xe <span style={{ color: '#ef4444' }}>*</span>
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        size="small"
                        disabled
                    >
                        <MenuItem value="bike">Xe máy</MenuItem>
                        <MenuItem value="car">Ô tô</MenuItem>
                    </TextField>
                </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                        Tầng hầm <span style={{ color: '#ef4444' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type="number"
                        name="basementFloor"
                        value={formData.basementFloor}
                        onChange={handleChange}
                        size="small"
                        inputProps={{ min: 1, max: 3 }}
                        disabled
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                        Vị trí / Ô đỗ <span style={{ color: '#ef4444' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        size="small"
                        disabled
                    />
                </Box>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button onClick={onCancel} color="error" fullWidth disabled={loading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Thêm mới'}
                </Button>
            </Stack>
        </Stack>
    );
};

export default AddVehicleFormInline;
