// frontend/src/views/admin/household/HouseholdManagement.jsx

import React, { useState, useEffect } from 'react';

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
    TextField,
    Tooltip,
    Typography,
    Stack,
    Select,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
    Autocomplete,
    Snackbar,
    Alert
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search, Filter, Home, Users, UserPlus } from 'lucide-react';

const HouseholdManagement = () => {
    // --- 1. MOCK DATA ---
    const MOCK_APARTMENTS = [
        { id: 101, room_number: 'A101', area: 75, status: 1 },
        { id: 102, room_number: 'A102', area: 80, status: 1 },
        { id: 205, room_number: 'B205', area: 65, status: 0 }
    ];

    const MOCK_RESIDENTS = [
        { id: 1, full_name: 'Nguyễn Văn A', id_number: '001090000001', phone: '0901000001', gender: 'Nam' },
        { id: 2, full_name: 'Trần Thị B', id_number: '001090000002', phone: '0901000002', gender: 'Nữ' },
        { id: 3, full_name: 'Lê Văn C', id_number: '001090000003', phone: '0901000003', gender: 'Nam' },
        { id: 4, full_name: 'Phạm Thị D', id_number: '001090000004', phone: '0901000004', gender: 'Nữ' }
    ];

    const [households, setHouseholds] = useState([]);
    const [availableApartments, setAvailableApartments] = useState([]); // Danh sách phòng available

    // --- 2. STATE ---
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Filter Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Family roles constant (matching backend)
    const FAMILY_ROLES = [
        { value: 'Chủ hộ', label: 'Chủ hộ' },
        { value: 'Vợ', label: 'Vợ' },
        { value: 'Chồng', label: 'Chồng' },
        { value: 'Con', label: 'Con' },
        { value: 'Bố mẹ', label: 'Bố mẹ' },
        { value: 'Thành viên khác', label: 'Thành viên khác' },
        { value: 'Khác', label: 'Khác (Ở ghép/Tạm trú)' }
    ];

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        apartment_id: '',
        head_of_household: '',
        status: 1,
        start_day: ''
    });

    // Tab state
    const [tabValue, setTabValue] = useState(0);

    // Members state
    const [currentMembers, setCurrentMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');

    // Search residents for adding to household
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [tempMembers, setTempMembers] = useState([]); // Danh sách members tạm thời khi tạo mới

    // Delete member confirmation dialog state
    const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);
    const [deletingMember, setDeletingMember] = useState(null);

    // Edit member dialog state
    const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [memberFormData, setMemberFormData] = useState({
        fullName: '',
        idNumber: '',
        dateOfBirth: '',
        gender: '',
        familyRole: '',
        phoneNumber: '',
        householdId: '',
        job: ''
    });

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- 3. FETCH DATA FROM BACKEND ---
    const fetchHouseholds = async () => {
        setLoading(true);
        try {
            const requestBody = {
                searchKeyword: searchTerm || null,
                status: statusFilter === 'ALL' ? null : parseInt(statusFilter)
            };

            const response = await fetch('http://localhost:8080/household/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // Handle 404 (no results found)
                if (response.status === 404) {
                    setHouseholds([]);
                    return;
                }
                throw new Error('Failed to fetch households');
            }

            const result = await response.json();
            const householdsData = result.result;


            // Map backend response to frontend format
            const mappedData = householdsData.map((item) => ({
                household_id: item.householdId,
                apartment_id: item.apartment, // Số phòng từ apartment
                head_of_household: item.headOfHouseholdName,
                status: parseInt(item.status),
                start_day: item.startDay,
                members: item.members ? item.members.map(member => ({
                    id: member.residentId,
                    full_name: member.fullName,
                    id_number: member.idNumber,
                    role: member.familyRole,
                    date_of_birth: member.dateOfBirth,
                    gender: member.gender,
                    phone_number: member.phoneNumber,
                    job: member.job
                })) : []
            }));

            setHouseholds(mappedData);
        } catch (error) {
            console.error('Error fetching households:', error);
            setSnackbar({ open: true, message: 'Lỗi khi tải dữ liệu hộ khẩu!', severity: 'error' });
            setHouseholds([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available apartments
    const fetchAvailableApartments = async () => {
        try {
            const response = await fetch('http://localhost:8080/household/available-apartments');
            if (!response.ok) throw new Error('Failed to fetch apartments');

            const result = await response.json();
            setAvailableApartments(result.result || []);
        } catch (error) {
            console.error('Error fetching apartments:', error);
            setAvailableApartments([]);
        }
    };

    // Fetch data when component mounts or filters change
    useEffect(() => {
        fetchHouseholds();
        fetchAvailableApartments(); // Load apartments khi component mount
    }, [searchTerm, statusFilter]);

    // Use data directly (no client-side filtering needed)
    const filteredData = households;

    // --- 4. HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (status) => {
        if (status !== null && status !== undefined) setStatusFilter(status);
        setAnchorEl(null);
    };

    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                apartment_id: record.apartment_id,
                head_of_household: record.head_of_household,
                status: record.status,
                start_day: record.start_day
            });
            setCurrentMembers([...record.members]);
        } else {
            setEditingRecord(null);
            setFormData({
                apartment_id: '',
                head_of_household: '',
                status: 1,
                start_day: new Date().toISOString().split('T')[0]
            });
            setCurrentMembers([]);
        }
        setTabValue(0);
        setSelectedMemberId('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
        setTempMembers([]); // Clear temp members
        setSearchQuery(''); // Clear search
        setSearchResults([]); // Clear search results
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Search residents by name or ID number
    const handleSearchResidents = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/resident/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchKeyword: searchQuery,
                    hasHousehold: false, // Only show residents without household
                    page: 1,
                    pageSize: 10
                })
            });

            if (!response.ok) throw new Error('Failed to search residents');

            const result = await response.json();
            setSearchResults(result.result?.data || []);
        } catch (error) {
            console.error('Error searching residents:', error);
            setSnackbar({ open: true, message: 'Lỗi khi tìm kiếm cư dân!', severity: 'error' });
        }
    };

    // Add resident to temp members list (create mode) or to household (edit mode)
    const handleAddMemberToList = async (resident) => {
        // Check if already added
        const existingList = editingRecord ? currentMembers : tempMembers;
        if (existingList.find(m => (m.residentId || m.id) === resident.residentId)) {
            setSnackbar({ open: true, message: 'Cư dân đã có trong danh sách!', severity: 'warning' });
            return;
        }

        // Check if trying to add a second head of household
        if (resident.familyRole === 'Chủ hộ') {
            const hasHead = existingList.some(m => (m.familyRole || m.role) === 'Chủ hộ');
            if (hasHead) {
                setSnackbar({ open: true, message: 'Hộ khẩu đã có Chủ hộ! Không thể thêm Chủ hộ thứ 2.', severity: 'error' });
                return;
            }
        }

        if (editingRecord) {
            // EDIT MODE: Call API to add resident to household
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/resident/update/${resident.residentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: resident.fullName,
                        idNumber: resident.idNumber,
                        dateOfBirth: resident.dateOfBirth,
                        gender: resident.gender,
                        familyRole: resident.familyRole,
                        phoneNumber: resident.phoneNumber,
                        job: resident.job,
                        householdId: editingRecord.household_id // Add to current household
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to add resident to household');
                }

                setSnackbar({ open: true, message: 'Thêm thành viên thành công!', severity: 'success' });
                setSearchQuery('');
                setSearchResults([]);
                fetchHouseholds(); // Reload to get updated members
            } catch (error) {
                console.error('Error adding resident to household:', error);
                setSnackbar({ open: true, message: error.message || 'Lỗi khi thêm thành viên!', severity: 'error' });
            } finally {
                setLoading(false);
            }
        } else {
            // CREATE MODE: Add to temp list
            setTempMembers([...tempMembers, {
                residentId: resident.residentId,
                fullName: resident.fullName,
                idNumber: resident.idNumber,
                familyRole: resident.familyRole || '' // Use existing role from resident
            }]);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    // Remove member from temp list
    const handleRemoveTempMember = (residentId) => {
        setTempMembers(tempMembers.filter(m => m.residentId !== residentId));
    };

    // Update member role in temp list
    const handleUpdateMemberRole = (residentId, role) => {
        setTempMembers(tempMembers.map(m =>
            m.residentId === residentId ? { ...m, familyRole: role } : m
        ));
    };


    const handleSave = async () => {
        // Validate required fields
        if (!formData.apartment_id) {
            setSnackbar({ open: true, message: 'Vui lòng chọn căn hộ!', severity: 'warning' });
            setTabValue(0); // Switch to general info tab
            return;
        }
        if (!formData.start_day) {
            setSnackbar({ open: true, message: 'Vui lòng chọn ngày chuyển đến!', severity: 'warning' });
            setTabValue(0);
            return;
        }

        // Validate members based on mode
        const membersToCheck = editingRecord ? currentMembers : tempMembers;
        if (membersToCheck.length === 0) {
            setSnackbar({ open: true, message: 'Hộ khẩu phải có ít nhất 1 thành viên!', severity: 'error' });
            setTabValue(1); // Switch to members tab
            return;
        }

        if (editingRecord) {
            // Check if there are any changes
            const hasChanges =
                formData.apartment_id !== editingRecord.apartment_id ||
                formData.start_day !== editingRecord.start_day ||
                formData.status !== editingRecord.status;

            if (!hasChanges) {
                setSnackbar({ open: true, message: 'Chưa có thay đổi nào!', severity: 'warning' });
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/household/update/${editingRecord.household_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        apartment: formData.apartment_id, // Send room number as string
                        startDay: formData.start_day,
                        status: formData.status.toString() // Convert to string
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to update household');
                }

                setSnackbar({ open: true, message: 'Cập nhật hộ khẩu thành công!', severity: 'success' });
                handleClose();
                fetchHouseholds(); // Reload data
            } catch (error) {
                console.error('Error updating household:', error);
                setSnackbar({ open: true, message: error.message || 'Lỗi khi cập nhật hộ khẩu!', severity: 'error' });
            } finally {
                setLoading(false);
            }
        } else {
            // Create new household
            // Validate tempMembers
            if (tempMembers.length === 0) {
                setSnackbar({ open: true, message: 'Phải có ít nhất 1 thành viên!', severity: 'warning' });
                setTabValue(1);
                return;
            }

            // Check if all members have roles
            const membersWithoutRole = tempMembers.filter(m => !m.familyRole);
            if (membersWithoutRole.length > 0) {
                setSnackbar({ open: true, message: 'Vui lòng chọn vai trò cho tất cả thành viên!', severity: 'warning' });
                setTabValue(1);
                return;
            }

            // Check if there's at least one "Chủ hộ"
            const headCount = tempMembers.filter(m => m.familyRole === 'Chủ hộ').length;
            if (headCount === 0) {
                setSnackbar({ open: true, message: 'Phải có ít nhất 1 Chủ hộ!', severity: 'warning' });
                setTabValue(1);
                return;
            }

            // Check if there's more than one "Chủ hộ"
            if (headCount > 1) {
                setSnackbar({ open: true, message: 'Không thể có nhiều hơn 1 Chủ hộ!', severity: 'error' });
                setTabValue(1);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/household/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        apartment: formData.apartment_id,
                        startDay: formData.start_day,
                        status: formData.status.toString(),
                        members: tempMembers.map(m => ({
                            residentId: m.residentId,
                            familyRole: m.familyRole
                        }))
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to create household');
                }

                setSnackbar({ open: true, message: 'Tạo hộ khẩu thành công!', severity: 'success' });
                handleClose();
                setTempMembers([]); // Clear temp members
                fetchHouseholds(); // Reload data
            } catch (error) {
                console.error('Error creating household:', error);
                setSnackbar({ open: true, message: error.message || 'Lỗi khi tạo hộ khẩu!', severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };


    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingRecord) {
            setHouseholds(households.filter((item) => item.household_id !== deletingRecord.household_id));
            setSnackbar({ open: true, message: 'Xóa hộ khẩu thành công!', severity: 'success' });
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // Member handlers
    const handleAddMember = () => {
        if (!selectedMemberId) return;

        const resident = MOCK_RESIDENTS.find((r) => r.id === parseInt(selectedMemberId));
        if (!resident) return;

        if (currentMembers.some((m) => m.id === resident.id)) {
            return;
        }

        const newMember = { ...resident, role: 'Thành viên' };
        setCurrentMembers([...currentMembers, newMember]);
        setSelectedMemberId('');
    };

    const handleRemoveMember = (member) => {
        setDeletingMember(member);
        setDeleteMemberDialogOpen(true);
    };

    const confirmDeleteMember = async () => {
        if (!deletingMember) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/resident/delete1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    residentId: deletingMember.id,
                    fullName: deletingMember.full_name,
                    idNumber: deletingMember.id_number,
                    familyRole: deletingMember.role,
                    dateOfBirth: deletingMember.date_of_birth,
                    gender: deletingMember.gender
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete resident');
            }

            setSnackbar({ open: true, message: 'Xóa thành viên thành công!', severity: 'success' });
            setDeleteMemberDialogOpen(false);
            setDeletingMember(null);

            // Close the update household dialog and reload data
            handleClose();
            fetchHouseholds();
        } catch (error) {
            console.error('Error deleting member:', error);
            setSnackbar({ open: true, message: error.message || 'Lỗi khi xóa thành viên!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditMember = (member) => {
        setEditingMember(member);
        setMemberFormData({
            fullName: member.full_name || '',
            idNumber: member.id_number || '',
            dateOfBirth: member.date_of_birth || '',
            gender: member.gender || '',
            familyRole: member.role || '',
            phoneNumber: member.phone_number || '',
            householdId: editingRecord?.household_id || '',
            job: member.job || ''
        });
        setEditMemberDialogOpen(true);
    };

    const handleSaveMember = async () => {
        if (!editingMember) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/resident/update/${editingMember.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: memberFormData.fullName,
                    idNumber: memberFormData.idNumber,
                    dateOfBirth: memberFormData.dateOfBirth,
                    gender: memberFormData.gender,
                    familyRole: memberFormData.familyRole,
                    phoneNumber: memberFormData.phoneNumber,
                    job: memberFormData.job
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update resident');
            }

            setSnackbar({ open: true, message: 'Cập nhật thành viên thành công!', severity: 'success' });
            setEditMemberDialogOpen(false);
            setEditingMember(null);

            // Close the update household dialog and reload data
            handleClose();
            fetchHouseholds();
        } catch (error) {
            console.error('Error updating member:', error);
            setSnackbar({ open: true, message: error.message || 'Lỗi khi cập nhật thành viên!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // --- HELPER ---
    const getApartmentName = (apartment) => apartment || '---'; // Display apartment (room_number) directly
    const getHeadName = (name) => name || '---'; // Now receiving name directly from backend


    const getStatusChip = (status) => {
        if (status === 1) {
            return (
                <Chip
                    label="Đang ở"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        fontWeight: 500,
                        border: 'none',
                        minWidth: 70,
                        justifyContent: 'center'
                    }}
                />
            );
        }
        return (
            <Chip
                label="Đã đi"
                size="small"
                sx={{
                    bgcolor: 'rgba(100, 100, 100, 0.2)',
                    color: '#94a3b8',
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 70,
                    justifyContent: 'center'
                }}
            />
        );
    };

    const getMemberCountChip = (count) => {
        return (
            <Chip
                label={`${count} người`}
                size="small"
                sx={{
                    bgcolor: 'rgba(139, 92, 246, 0.15)',
                    color: '#a78bfa',
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 70,
                    justifyContent: 'center'
                }}
            />
        );
    };

    const getHouseholdIdChip = (id) => {
        return (
            <Chip
                label={`H${id}`}
                size="small"
                sx={{
                    bgcolor: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 50,
                    justifyContent: 'center'
                }}
            />
        );
    };

    // Header action buttons for the top right corner
    const headerActions = (
        <Stack direction="row" spacing={1.5} alignItems="center">
            {/* SEARCH BAR */}
            <OutlinedInput
                placeholder="Tìm hộ khẩu theo Tên chủ hộ, CCCD, Số phòng"
                startAdornment={
                    <InputAdornment position="start">
                        <Search size={18} />
                    </InputAdornment>
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    minWidth: 340,
                    borderRadius: '12px'
                }}
                size="small"
            />

            {/* FILTER BUTTON */}
            <Tooltip title="Lọc theo trạng thái">
                <IconButton
                    onClick={handleFilterClick}
                    color={statusFilter !== 'ALL' ? 'primary' : 'inherit'}
                    sx={{
                        border: '1px solid',
                        borderColor: statusFilter !== 'ALL' ? 'primary.main' : 'divider',
                        borderRadius: '12px',
                        padding: '10px'
                    }}
                >
                    <Filter size={20} />
                </IconButton>
            </Tooltip>

            {/* FILTER MENU */}
            <Menu
                anchorEl={anchorEl}
                open={openFilter}
                onClose={() => handleFilterClose(null)}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px',
                        marginTop: 1,
                        minWidth: 160
                    }
                }}
            >
                <MenuItem onClick={() => handleFilterClose('ALL')} selected={statusFilter === 'ALL'}>
                    Tất cả trạng thái
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('1')} selected={statusFilter === '1'}>
                    Đang sinh sống
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('0')} selected={statusFilter === '0'}>
                    Đã chuyển đi
                </MenuItem>
            </Menu>

            {/* ADD BUTTON */}
            <Tooltip title="Tạo hộ khẩu mới">
                <Button
                    variant="contained"
                    onClick={() => handleOpen()}
                    sx={{
                        minWidth: 48,
                        width: 48,
                        height: 44,
                        borderRadius: '12px',
                        padding: 0
                    }}
                >
                    <Plus size={22} />
                </Button>
            </Tooltip>
        </Stack>
    );

    return (
        <MainCard title="Quản lý Hộ khẩu" secondary={headerActions} contentSX={{ pt: 0 }}>
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
                            <TableCell align="center" sx={{ width: 60 }}>STT</TableCell>
                            <TableCell>Phòng</TableCell>
                            <TableCell>Chủ hộ</TableCell>
                            <TableCell align="center">Số thành viên</TableCell>
                            <TableCell>Ngày vào</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={row.household_id} hover>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Home size={16} style={{ color: '#64748b' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {getApartmentName(row.apartment_id)}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{getHeadName(row.head_of_household)}</TableCell>
                                <TableCell align="center">{getMemberCountChip(row.members.length)}</TableCell>
                                <TableCell>
                                    {new Date(row.start_day).toLocaleDateString('vi-VN')}
                                </TableCell>
                                <TableCell align="center">{getStatusChip(row.status)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Sửa">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(row)}
                                            size="small"
                                        >
                                            <Edit size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(row)}
                                            size="small"
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" sx={{ py: 3 }}>
                                        Không tìm thấy dữ liệu
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* DIALOG (MODAL) */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>
                    {editingRecord ? 'Cập nhật Hộ khẩu' : 'Tạo Hộ khẩu mới'}
                </DialogTitle>
                <DialogContent>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            mb: 2,
                            '& .MuiTab-root': {
                                flex: 1,
                                maxWidth: 'none'
                            }
                        }}
                    >
                        <Tab icon={<Home size={16} />} iconPosition="start" label="Thông tin chung" />
                        <Tab icon={<Users size={16} />} iconPosition="start" label={`Thành viên (${currentMembers.length})`} />
                    </Tabs>

                    {tabValue === 0 && (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Autocomplete
                                fullWidth
                                options={availableApartments}
                                getOptionLabel={(option) => `${option.roomNumber} (${option.area}m²)`}
                                filterOptions={(options, { inputValue }) => {
                                    const searchTerm = inputValue.toLowerCase();
                                    return options.filter((option) =>
                                        option.roomNumber.toString().toLowerCase().includes(searchTerm)
                                    );
                                }}
                                value={availableApartments.find((a) => a.roomNumber.toString() === formData.apartment_id) || null}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, apartment_id: newValue ? newValue.roomNumber.toString() : '' });
                                }}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.apartmentId}>
                                        <Stack direction="row" justifyContent="space-between" width="100%">
                                            <Typography variant="body1" fontWeight={500}>
                                                Phòng {option.roomNumber}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {option.area}m² - Tầng {option.floor}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Số phòng"
                                        placeholder="Chọn số phòng..."
                                    />
                                )}
                                noOptionsText="Không có phòng trống"
                            />

                            <Stack direction="row" spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Ngày chuyển đến"
                                    name="start_day"
                                    type="date"
                                    value={formData.start_day}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value={1}>Đang sinh sống</MenuItem>
                                        <MenuItem value={0}>Đã chuyển đi</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                    )}

                    {tabValue === 1 && (
                        <Box sx={{ mt: 2 }}>
                            {/* CREATE MODE: Search and add residents */}
                            {!editingRecord && (
                                <>
                                    {/* Search box */}
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            bgcolor: 'action.hover',
                                            borderRadius: 2
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Tìm kiếm cư dân (Tên, CCCD, SĐT)"
                                            placeholder="Nhập để tìm kiếm..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearchResidents();
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search size={18} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            startIcon={<UserPlus size={18} />}
                                            onClick={handleSearchResidents}
                                            disabled={!searchQuery.trim()}
                                        >
                                            Tìm
                                        </Button>
                                    </Stack>

                                    {/* Search results */}
                                    {searchResults.length > 0 && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Kết quả tìm kiếm:</Typography>
                                            <Stack spacing={1}>
                                                {searchResults.map((resident) => (
                                                    <Stack
                                                        key={resident.residentId}
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}
                                                    >
                                                        <Stack>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {resident.fullName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                CCCD: {resident.idNumber} | SĐT: {resident.phoneNumber}
                                                            </Typography>
                                                        </Stack>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleAddMemberToList(resident)}
                                                        >
                                                            Thêm
                                                        </Button>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Temp members table */}
                                    <TableContainer>
                                        <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Họ tên</TableCell>
                                                    <TableCell>CCCD</TableCell>
                                                    <TableCell>Vai trò</TableCell>
                                                    <TableCell align="center">Hành động</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tempMembers.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                            Chưa có thành viên nào
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    tempMembers.map((member) => (
                                                        <TableRow key={member.residentId}>
                                                            <TableCell>{member.fullName}</TableCell>
                                                            <TableCell>{member.idNumber}</TableCell>
                                                            <TableCell>
                                                                {member.familyRole ? (
                                                                    <Chip
                                                                        label={member.familyRole}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: member.familyRole === 'Chủ hộ'
                                                                                ? 'rgba(234, 179, 8, 0.15)'
                                                                                : 'rgba(100, 116, 139, 0.15)',
                                                                            color: member.familyRole === 'Chủ hộ'
                                                                                ? '#fbbf24'
                                                                                : '#94a3b8',
                                                                            fontWeight: 500,
                                                                            minWidth: 80,
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Chưa có vai trò
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Tooltip title="Xóa">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRemoveTempMember(member.residentId)}
                                                                        sx={{ color: 'error.main' }}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}

                            {/* EDIT MODE: Show existing members */}
                            {editingRecord && (
                                <>
                                    {/* Search box - same as create mode */}
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            bgcolor: 'action.hover',
                                            borderRadius: 2
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Tìm kiếm cư dân (Tên, CCCD, SĐT)"
                                            placeholder="Nhập để tìm kiếm..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearchResidents();
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search size={18} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            startIcon={<UserPlus size={18} />}
                                            onClick={handleSearchResidents}
                                            disabled={!searchQuery.trim()}
                                        >
                                            Tìm
                                        </Button>
                                    </Stack>

                                    {/* Search results */}
                                    {searchResults.length > 0 && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Kết quả tìm kiếm:</Typography>
                                            <Stack spacing={1}>
                                                {searchResults.map((resident) => (
                                                    <Stack
                                                        key={resident.residentId}
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}
                                                    >
                                                        <Stack>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {resident.fullName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                CCCD: {resident.idNumber} | SĐT: {resident.phoneNumber}
                                                            </Typography>
                                                        </Stack>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleAddMemberToList(resident)}
                                                        >
                                                            Thêm
                                                        </Button>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Members table */}
                                    <TableContainer>
                                        <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Họ tên</TableCell>
                                                    <TableCell>CCCD</TableCell>
                                                    <TableCell>Vai trò</TableCell>
                                                    <TableCell align="center">Hành động</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentMembers.map((member) => (
                                                    <TableRow key={member.id}>
                                                        <TableCell>{member.full_name}</TableCell>
                                                        <TableCell>{member.id_number}</TableCell>
                                                        <TableCell>
                                                            {member.id === formData.head_of_household ? (
                                                                <Chip
                                                                    label="Chủ hộ"
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(234, 179, 8, 0.15)',
                                                                        color: '#fbbf24',
                                                                        fontWeight: 500,
                                                                        minWidth: 80,
                                                                        justifyContent: 'center'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    label={member.role || 'Thành viên'}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(100, 116, 139, 0.15)',
                                                                        color: '#94a3b8',
                                                                        fontWeight: 500,
                                                                        minWidth: 80,
                                                                        justifyContent: 'center'
                                                                    }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                                <Tooltip title="Chỉnh sửa thành viên">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleEditMember(member)}
                                                                        sx={{
                                                                            color: '#3b82f6',
                                                                            '&:hover': {
                                                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                                                color: '#2563eb'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Edit size={18} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={member.id === formData.head_of_household ? "Không thể xóa chủ hộ" : "Xóa khỏi hộ"}>
                                                                    <span>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleRemoveMember(member)}
                                                                            disabled={member.id === formData.head_of_household}
                                                                            sx={{
                                                                                color: member.id === formData.head_of_household ? 'text.disabled' : '#ef4444',
                                                                                '&:hover': {
                                                                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                                                    color: '#dc2626'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {currentMembers.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
                                                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                                                Chưa có thành viên nào
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleClose} color="error">Hủy</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {editingRecord ? 'Cập nhật' : 'Tạo mới'}
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
                    Xác nhận xóa hộ khẩu
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa hộ khẩu{' '}
                        <strong>H{deletingRecord?.household_id}</strong> (Phòng {getApartmentName(deletingRecord?.apartment_id)})?
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
                        Xóa hộ khẩu
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

            {/* Delete Member Confirmation Dialog */}
            <Dialog
                open={deleteMemberDialogOpen}
                onClose={() => setDeleteMemberDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 2 }}>
                    Xác nhận xóa thành viên
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Bạn có chắc chắn muốn xóa thành viên này khỏi hệ thống?
                    </Typography>
                    {deletingMember && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                                {deletingMember.full_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                CCCD: {deletingMember.id_number}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        ⚠️ Hành động này không thể hoàn tác!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setDeleteMemberDialogOpen(false)}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={confirmDeleteMember}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog
                open={editMemberDialogOpen}
                onClose={() => setEditMemberDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Cập nhật thông tin cư dân</DialogTitle>
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
                                    value={memberFormData.fullName}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, fullName: e.target.value })}
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
                                    value={memberFormData.dateOfBirth}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, dateOfBirth: e.target.value })}
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
                                    value={memberFormData.gender}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, gender: e.target.value })}
                                    size="small"
                                >
                                    <MenuItem value="Nam">Nam</MenuItem>
                                    <MenuItem value="Nữ">Nữ</MenuItem>
                                </TextField>
                            </Box>
                            <Box sx={{ flex: 2 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập số điện thoại"
                                    value={memberFormData.phoneNumber || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, phoneNumber: e.target.value })}
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
                                    value={memberFormData.idNumber}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, idNumber: e.target.value })}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Mã hộ gia đình (Tùy chọn)
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="VD: 14 (Bỏ trống nếu chưa có)"
                                    value={memberFormData.householdId || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, householdId: e.target.value })}
                                    size="small"
                                    disabled
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
                                    value={memberFormData.familyRole}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, familyRole: e.target.value })}
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
                                    value={memberFormData.job || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, job: e.target.value })}
                                    size="small"
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setEditMemberDialogOpen(false)}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSaveMember}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Cập Nhật'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default HouseholdManagement;
