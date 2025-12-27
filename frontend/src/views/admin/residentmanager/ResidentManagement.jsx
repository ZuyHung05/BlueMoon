// frontend/src/views/admin/residentmanager/ResidentManagement.jsx

import React, { useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Tooltip,
    Typography,
    Stack,
    Snackbar,
    Alert,
    Divider
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

const ResidentManagement = () => {
    // --- 1. MOCK DATA ---
    const [data, setData] = useState([
        {
            id: 1,
            full_name: 'Nguyễn Văn A',
            gender: 'male',
            date_of_birth: '1990-05-15',
            phone_number: '0987654321',
            id_number: '001090000001',
            family_role: 'Chủ hộ',
            job: 'Kỹ sư',
            household_id: 'H001'
        },
        {
            id: 2,
            full_name: 'Trần Thị B',
            gender: 'female',
            date_of_birth: '1992-08-20',
            phone_number: '0901234567',
            id_number: '001092000002',
            family_role: 'Vợ',
            job: 'Giáo viên',
            household_id: 'H001'
        },
        {
            id: 3,
            full_name: 'Lê Văn C',
            gender: 'male',
            date_of_birth: '2000-10-10',
            phone_number: '0912345678',
            id_number: '001200000003',
            family_role: 'Khác',
            job: 'Sinh viên',
            household_id: ''
        },
        {
            id: 4,
            full_name: 'Phạm Văn D',
            gender: 'male',
            date_of_birth: '1975-03-12',
            phone_number: '0923456789',
            id_number: '001075000004',
            family_role: 'Chủ hộ',
            job: 'Kinh doanh',
            household_id: 'H002'
        },
        {
            id: 5,
            full_name: 'Hoàng Thị E',
            gender: 'female',
            date_of_birth: '1978-11-25',
            phone_number: '0934567890',
            id_number: '001078000005',
            family_role: 'Vợ',
            job: 'Kế toán',
            household_id: 'H002'
        },
        {
            id: 6,
            full_name: 'Phạm Hoàng F',
            gender: 'male',
            date_of_birth: '2005-07-14',
            phone_number: '0945678901',
            id_number: '001205000006',
            family_role: 'Con',
            job: 'Học sinh',
            household_id: 'H002'
        },
        {
            id: 7,
            full_name: 'Vũ Văn G',
            gender: 'male',
            date_of_birth: '1985-12-01',
            phone_number: '0956789012',
            id_number: '001085000007',
            family_role: 'Chủ hộ',
            job: 'Bác sĩ',
            household_id: 'H003'
        },
        {
            id: 8,
            full_name: 'Đặng Thị H',
            gender: 'female',
            date_of_birth: '1988-04-18',
            phone_number: '0967890123',
            id_number: '001088000008',
            family_role: 'Vợ',
            job: 'Nội trợ',
            household_id: 'H003'
        },
        {
            id: 9,
            full_name: 'Vũ Diệu I',
            gender: 'female',
            date_of_birth: '2012-09-30',
            phone_number: '0978901234',
            id_number: '001212000009',
            family_role: 'Con',
            job: 'Học sinh',
            household_id: 'H003'
        },
        {
            id: 10,
            full_name: 'Đỗ Văn K',
            gender: 'male',
            date_of_birth: '1960-01-20',
            phone_number: '0989012345',
            id_number: '001060000010',
            family_role: 'Chủ hộ',
            job: 'Nghỉ hưu',
            household_id: 'H004'
        },
        {
            id: 11,
            full_name: 'Bùi Thị L',
            gender: 'female',
            date_of_birth: '1963-06-15',
            phone_number: '0990123456',
            id_number: '001063000011',
            family_role: 'Vợ',
            job: 'Công nhân',
            household_id: 'H004'
        },
        {
            id: 12,
            full_name: 'Đỗ Tiến M',
            gender: 'male',
            date_of_birth: '1995-10-05',
            phone_number: '0911234567',
            id_number: '001095000012',
            family_role: 'Con',
            job: 'Lập trình viên',
            household_id: 'H004'
        },
        {
            id: 13,
            full_name: 'Lý Văn N',
            gender: 'male',
            date_of_birth: '1998-02-28',
            phone_number: '0922345678',
            id_number: '001098000013',
            family_role: 'Chủ hộ',
            job: 'Kiến trúc sư',
            household_id: 'H005'
        },
        {
            id: 14,
            full_name: 'Trịnh Thị O',
            gender: 'female',
            date_of_birth: '2000-05-12',
            phone_number: '0933456789',
            id_number: '001200000014',
            family_role: 'Vợ',
            job: 'Nhân viên văn phòng',
            household_id: 'H005'
        },
        {
            id: 15,
            full_name: 'Đinh Văn P',
            gender: 'male',
            date_of_birth: '1982-11-11',
            phone_number: '0944567890',
            id_number: '001082000015',
            family_role: 'Chủ hộ',
            job: 'Công an',
            household_id: 'H006'
        },
        {
            id: 16,
            full_name: 'Trần Thị Q',
            gender: 'female',
            date_of_birth: '1985-08-08',
            phone_number: '0955678901',
            id_number: '001085000016',
            family_role: 'Vợ',
            job: 'Y tá',
            household_id: 'H006'
        },
        {
            id: 17,
            full_name: 'Đinh Công R',
            gender: 'male',
            date_of_birth: '2010-01-01',
            phone_number: '0966789012',
            id_number: '001210000017',
            family_role: 'Con',
            job: 'Học sinh',
            household_id: 'H006'
        },
        {
            id: 18,
            full_name: 'Hà Văn S',
            gender: 'male',
            date_of_birth: '1993-04-04',
            phone_number: '0977890123',
            id_number: '001093000018',
            family_role: 'Khác',
            job: 'Tài xế',
            household_id: ''
        },
        {
            id: 19,
            full_name: 'Phan Thị T',
            gender: 'female',
            date_of_birth: '1997-07-07',
            phone_number: '0988901234',
            id_number: '001097000019',
            family_role: 'Khác',
            job: 'Nhân viên bán hàng',
            household_id: ''
        },
        {
            id: 20,
            full_name: 'Võ Văn U',
            gender: 'male',
            date_of_birth: '1980-09-09',
            phone_number: '0999012345',
            id_number: '001080000020',
            family_role: 'Chủ hộ',
            job: 'Thợ điện',
            household_id: 'H007'
        },
        {
            id: 21,
            full_name: 'Ngô Thị V',
            gender: 'female',
            date_of_birth: '1983-12-12',
            phone_number: '0911223344',
            id_number: '001083000021',
            family_role: 'Vợ',
            job: 'May mặc',
            household_id: 'H007'
        },
        {
            id: 22,
            full_name: 'Ngô Văn X',
            gender: 'male',
            date_of_birth: '2008-05-05',
            phone_number: '0922334455',
            id_number: '001208000022',
            family_role: 'Con',
            job: 'Học sinh',
            household_id: 'H007'
        },
        {
            id: 23,
            full_name: 'Hồ Thị Y',
            gender: 'female',
            date_of_birth: '1991-02-02',
            phone_number: '0933445566',
            id_number: '001091000023',
            family_role: 'Chủ hộ',
            job: 'Giảng viên',
            household_id: 'H008'
        }
    ]);

    // --- 2. STATE QUẢN LÝ UI ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter states
    const [genderFilter, setGenderFilter] = useState('ALL');
    const [householdFilter, setHouseholdFilter] = useState('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter menu anchor
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        gender: 'male',
        date_of_birth: '',
        phone_number: '',
        id_number: '',
        family_role: 'Thành viên khác',
        job: '',
        household_id: ''
    });

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // Check if any filter is active
    const isFilterActive = genderFilter !== 'ALL' || householdFilter !== 'ALL' || roleFilter !== 'ALL';

    // --- 3. FILTERING ---
    const filteredData = data.filter((item) => {
        const matchText =
            item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone_number.includes(searchTerm) ||
            item.id_number.includes(searchTerm) ||
            (item.household_id && item.household_id.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchGender = genderFilter === 'ALL' || item.gender === genderFilter;

        let matchHousehold = true;
        if (householdFilter === 'HAS_HOUSEHOLD') matchHousehold = !!item.household_id;
        if (householdFilter === 'NO_HOUSEHOLD') matchHousehold = !item.household_id;

        const matchRole = roleFilter === 'ALL' || 
                          (roleFilter === 'OWNER' && item.family_role === 'Chủ hộ');

        return matchText && matchGender && matchHousehold && matchRole;
    });

    // --- 4. HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleResetFilters = () => {
        setGenderFilter('ALL');
        setHouseholdFilter('ALL');
        setRoleFilter('ALL');
        setAnchorEl(null);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                full_name: record.full_name,
                gender: record.gender,
                date_of_birth: record.date_of_birth,
                phone_number: record.phone_number,
                id_number: record.id_number,
                family_role: record.family_role,
                job: record.job,
                household_id: record.household_id || ''
            });
        } else {
            setEditingRecord(null);
            setFormData({
                full_name: '',
                gender: 'male',
                date_of_birth: '',
                phone_number: '',
                id_number: '',
                family_role: 'Thành viên khác',
                job: '',
                household_id: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Validate required fields
        if (!formData.full_name) {
            setSnackbar({ open: true, message: 'Vui lòng nhập họ tên!', severity: 'warning' });
            return;
        }
        if (!formData.date_of_birth) {
            setSnackbar({ open: true, message: 'Vui lòng chọn ngày sinh!', severity: 'warning' });
            return;
        }
        if (!formData.id_number) {
            setSnackbar({ open: true, message: 'Vui lòng nhập số CCCD!', severity: 'warning' });
            return;
        }
        if (!formData.phone_number) {
            setSnackbar({ open: true, message: 'Vui lòng nhập số điện thoại!', severity: 'warning' });
            return;
        }

        if (editingRecord) {
            const updatedData = data.map((item) =>
                item.id === editingRecord.id ? { ...item, ...formData } : item
            );
            setData(updatedData);
            setSnackbar({ open: true, message: 'Cập nhật cư dân thành công!', severity: 'success' });
        } else {
            const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
            setData([...data, { id: newId, ...formData }]);
            setSnackbar({ open: true, message: 'Thêm cư dân mới thành công!', severity: 'success' });
        }
        handleClose();
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingRecord) {
            if (deletingRecord.family_role === 'Chủ hộ') {
                setSnackbar({ open: true, message: 'Không thể xóa cư dân đang là Chủ hộ! Hãy đổi chủ hộ trước.', severity: 'error' });
                setDeleteDialogOpen(false);
                setDeletingRecord(null);
                return;
            }
            setData(data.filter((item) => item.id !== deletingRecord.id));
            setSnackbar({ open: true, message: 'Đã xóa cư dân!', severity: 'success' });
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // --- 5. HELPER FUNCTIONS ---
    const getGenderChip = (gender) => {
        return gender === 'male' ? (
            <Chip label="Nam" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 500, minWidth: 60, justifyContent: 'center' }} />
        ) : (
            <Chip label="Nữ" size="small" sx={{ bgcolor: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', fontWeight: 500, minWidth: 60, justifyContent: 'center' }} />
        );
    };

    const getHouseholdChip = (householdId) => {
        return householdId ? (
            <Chip label={householdId} size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 500, minWidth: 70, justifyContent: 'center' }} />
        ) : (
            <Chip label="Chưa có" size="small" sx={{ bgcolor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', fontWeight: 500, minWidth: 70, justifyContent: 'center' }} />
        );
    };

    const getRoleChip = (role) => {
        if (role === 'Chủ hộ') {
            return <Chip label="Chủ hộ" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', fontWeight: 600, minWidth: 80, justifyContent: 'center' }} />;
        }
        return <Chip label={role} size="small" sx={{ bgcolor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', fontWeight: 500, minWidth: 80, justifyContent: 'center' }} />;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Cư dân
                </Typography>

                <Tooltip title="Thêm cư dân mới">
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => handleOpen()}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            minWidth: 'auto',
                            px: 2,
                            height: 40
                        }}
                    >
                        Thêm
                    </Button>
                </Tooltip>

                <Tooltip title="Lọc theo điều kiện">
                    <IconButton 
                        onClick={handleFilterClick}
                        color={isFilterActive ? 'primary' : 'inherit'}
                        sx={{ 
                            border: '1px solid',
                            borderColor: isFilterActive ? 'primary.main' : 'divider',
                            borderRadius: '12px',
                            padding: '8px',
                            height: 40,
                            width: 40
                        }}
                    >
                        <Filter size={20} />
                    </IconButton>
                </Tooltip>

                <OutlinedInput
                    placeholder="Tìm tên, SĐT, CCCD..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Search size={18} />
                        </InputAdornment>
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                        minWidth: 280,
                        borderRadius: '12px',
                        height: 40
                    }}
                    size="small"
                />
            </Box>

            {/* FILTER MENU */}
            <Menu
                anchorEl={anchorEl}
                open={openFilter}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px',
                        marginTop: 1,
                        minWidth: 200
                    }
                }}
            >
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                    Giới tính
                </Typography>
                <MenuItem onClick={() => setGenderFilter('ALL')} selected={genderFilter === 'ALL'}>
                    Tất cả
                </MenuItem>
                <MenuItem onClick={() => setGenderFilter('male')} selected={genderFilter === 'male'}>
                    Nam
                </MenuItem>
                <MenuItem onClick={() => setGenderFilter('female')} selected={genderFilter === 'female'}>
                    Nữ
                </MenuItem>
                <Divider />
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                    Hộ khẩu
                </Typography>
                <MenuItem onClick={() => setHouseholdFilter('ALL')} selected={householdFilter === 'ALL'}>
                    Tất cả
                </MenuItem>
                <MenuItem onClick={() => setHouseholdFilter('HAS_HOUSEHOLD')} selected={householdFilter === 'HAS_HOUSEHOLD'}>
                    Đã có hộ
                </MenuItem>
                <MenuItem onClick={() => setHouseholdFilter('NO_HOUSEHOLD')} selected={householdFilter === 'NO_HOUSEHOLD'}>
                    Chưa có hộ
                </MenuItem>
                <Divider />
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                    Vai trò
                </Typography>
                <MenuItem onClick={() => setRoleFilter('ALL')} selected={roleFilter === 'ALL'}>
                    Tất cả
                </MenuItem>
                <MenuItem onClick={() => setRoleFilter('OWNER')} selected={roleFilter === 'OWNER'}>
                    Chỉ Chủ hộ
                </MenuItem>
                {isFilterActive && (
                    <>
                        <Divider />
                        <MenuItem onClick={handleResetFilters} sx={{ color: 'error.main' }}>
                            Xóa bộ lọc
                        </MenuItem>
                    </>
                )}
            </Menu>
            {/* TABLE */}
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                    <TableHead sx={{ 
                        bgcolor: 'action.hover',
                        '& .MuiTableCell-root': {
                            color: 'text.primary',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }
                    }}>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell align="center">Giới tính</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>CCCD</TableCell>
                            <TableCell align="center">Mã hộ</TableCell>
                            <TableCell>Quan hệ</TableCell>
                            <TableCell>Công việc</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {row.full_name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">{getGenderChip(row.gender)}</TableCell>
                                <TableCell>{formatDate(row.date_of_birth)}</TableCell>
                                <TableCell>{row.phone_number}</TableCell>
                                <TableCell>{row.id_number}</TableCell>
                                <TableCell align="center">{getHouseholdChip(row.household_id)}</TableCell>
                                <TableCell>{getRoleChip(row.family_role)}</TableCell>
                                <TableCell>{row.job}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title="Sửa thông tin">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleOpen(row)}
                                                size="small"
                                            >
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa cư dân">
                                            <IconButton 
                                                sx={{
                                                    color: '#ef4444',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#dc2626'
                                                    }
                                                }}
                                                onClick={() => handleDelete(row)}
                                                size="small"
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                                        Không tìm thấy dữ liệu
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
                sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '.MuiTablePagination-toolbar': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pl: 1,
                        '&::after': {
                            content: '""',
                            flex: 1,
                            order: 10
                        }
                    },
                    '.MuiTablePagination-spacer': {
                        display: 'block',
                        flex: 1,
                        order: 2
                    },
                    '.MuiTablePagination-selectLabel': {
                        margin: 0,
                        lineHeight: 'inherit',
                        order: 0
                    },
                    '.MuiTablePagination-select': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '2px',
                        order: 1
                    },
                    '.MuiTablePagination-displayedRows': {
                        margin: '0 16px',
                        lineHeight: 'inherit',
                        fontWeight: 600,
                        color: 'primary.main',
                        order: 4
                    },
                    '.MuiTablePagination-actions': {
                        display: 'contents',
                        '& .MuiIconButton-root': {
                            borderRadius: '8px',
                            margin: '0 2px',
                            bgcolor: 'action.hover',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white'
                            },
                            '&.Mui-disabled': {
                                opacity: 0.3
                            }
                        },
                        '& .MuiIconButton-root:nth-of-type(1)': {
                            order: 3
                        },
                        '& .MuiIconButton-root:nth-of-type(2)': {
                            order: 5
                        }
                    }
                }}
            />

            {/* ADD/EDIT DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {editingRecord ? 'Cập nhật thông tin cư dân' : 'Thêm cư dân mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        {/* Row 1: Họ tên & Ngày sinh */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập họ và tên"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Ngày sinh <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Stack>

                        {/* Row 2: Giới tính & SĐT */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Giới tính <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    size="small"
                                >
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                </TextField>
                            </Box>
                            <Box sx={{ flex: 2 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập số điện thoại"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                        </Stack>

                        {/* Row 3: CCCD & Mã hộ */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Số CCCD <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập số CCCD"
                                    name="id_number"
                                    value={formData.id_number}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Mã hộ gia đình (Tùy chọn)
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="VD: H001 (Bỏ trống nếu chưa có)"
                                    name="household_id"
                                    value={formData.household_id}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                        </Stack>

                        {/* Row 4: Quan hệ & Công việc */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Quan hệ với chủ hộ <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="family_role"
                                    value={formData.family_role}
                                    onChange={handleChange}
                                    size="small"
                                >
                                    <MenuItem value="Chủ hộ">Chủ hộ</MenuItem>
                                    <MenuItem value="Vợ">Vợ</MenuItem>
                                    <MenuItem value="Chồng">Chồng</MenuItem>
                                    <MenuItem value="Con">Con</MenuItem>
                                    <MenuItem value="Bố mẹ">Bố mẹ</MenuItem>
                                    <MenuItem value="Thành viên khác">Thành viên khác</MenuItem>
                                    <MenuItem value="Khác">Khác (Ở ghép/Tạm trú)</MenuItem>
                                </TextField>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Công việc <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập công việc hiện tại"
                                    name="job"
                                    value={formData.job}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleClose} color="error">Hủy</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {editingRecord ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={handleCancelDelete}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Xác nhận xóa cư dân
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa cư dân <strong>{deletingRecord?.full_name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button onClick={handleCancelDelete} variant="outlined">
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                    >
                        Xóa cư dân
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        alignItems: 'center',
                        '& .MuiAlert-action': {
                            pt: 0,
                            alignItems: 'center'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default ResidentManagement;