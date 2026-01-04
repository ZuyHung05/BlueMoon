// frontend/src/views/admin/feemanager/PaymentPeriodManagement.jsx

import React, { useState, useEffect, useRef } from 'react';

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
    LinearProgress,
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
    Tabs,
    Tab,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search, Upload, Download, Printer, CheckCircle, XCircle, Users, Save } from 'lucide-react';
import dayjs from 'dayjs';

const PaymentPeriodManagement = () => {
    // --- STATE ---
    const [data, setData] = useState(() => {
        try {
            const cached = sessionStorage.getItem('PAYMENT_PERIODS_CACHE');
            return cached ? JSON.parse(cached) : [];
        } catch (e) {
            console.error('Error parsing cache', e);
            return [];
        }
    });
    const [householdDetails, setHouseholdDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // --- STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [periodFilter, setPeriodFilter] = useState('ALL'); // ALL, ONGOING, INCOMPLETE
    // const [searchTerm, setSearchTerm] = useState(''); // REPLACED BY DATE
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');

    // Pagination states for main table
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pagination states for detail table
    const [detailPage, setDetailPage] = useState(0);
    const [detailRowsPerPage, setDetailRowsPerPage] = useState(10);

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        start_date: '',
        end_date: '',
        is_mandatory: true
    });

    // Pay modal
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [targetHousehold, setTargetHousehold] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

    // Donation modal
    const [donationModalOpen, setDonationModalOpen] = useState(false);
    const [donationData, setDonationData] = useState({ household_id: '', amount: '', method: 'Tiền mặt' });

    // Detail modal
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [viewPaymentDetail, setViewPaymentDetail] = useState(null);

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Revert payment dialog
    const [revertDialogOpen, setRevertDialogOpen] = useState(false);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- API CALLS ---
    useEffect(() => {
        fetchPaymentPeriods();
    }, []);

    const fetchPaymentPeriods = async (start = null, end = null) => {
        // Only show loading if we really don't have data
        const hasCache = !!sessionStorage.getItem('PAYMENT_PERIODS_CACHE');
        if (!hasCache) {
            setLoading(true);
        }

        try {
            let url = `${import.meta.env.VITE_API_URL}/payment-periods`;
            const params = new URLSearchParams();
            if (start) params.append('startDate', start);
            if (end) params.append('endDate', end);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const result = await response.json();
            if (result.code === 1000) {
                const mappedData = result.result.map((item) => ({
                    ...item,
                    payment_period_id: item.paymentPeriodId || item.payment_period_id,
                    start_date: item.startDate || item.start_date,
                    end_date: item.endDate || item.end_date,
                    is_mandatory: item.isMandatory !== undefined ? item.isMandatory : item.is_mandatory
                }));
                mappedData.sort((a, b) => {
                    const dateA = new Date(a.end_date);
                    const dateB = new Date(b.end_date);
                    return dateB - dateA; // Sort Descending (Newest End Date first)
                });
                setData(mappedData);
                // Only cache if no filter is applied
                if (!start && !end) {
                    sessionStorage.setItem('PAYMENT_PERIODS_CACHE', JSON.stringify(mappedData));
                }
            }
        } catch (error) {
            console.error('Error fetching payment periods:', error);
            if (!hasCache) setSnackbar({ open: true, message: 'Lỗi khi tải danh sách đợt thu', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentPeriodDetails = async (id) => {
        // 1. Try to load from cache
        const cacheKey = 'PAYMENT_PERIOD_DETAILS_CACHE';
        let cacheMap = {};
        try {
            const raw = sessionStorage.getItem(cacheKey);
            if (raw) cacheMap = JSON.parse(raw);
        } catch (e) {
            console.error('Cache parse error', e);
        }

        if (cacheMap[id]) {
            setHouseholdDetails(cacheMap[id]);
        } else {
            setLoading(true);
        }

        // 2. Fetch fresh data (Stale-while-revalidate)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/${id}/details`);
            const result = await response.json();
            if (result.code === 1000) {
                setHouseholdDetails(result.result);

                // Update cache
                cacheMap[id] = result.result;
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(cacheMap));
                } catch (e) {
                    console.warn('SessionStorage full, cannot cache details');
                }
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            // Only show error if we have no data to show
            if (!cacheMap[id]) setSnackbar({ open: true, message: 'Lỗi khi tải chi tiết', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // --- FILTERING ---
    const filteredData = data.filter((item) => {
        // Search Term REMOVED - using server side filter
        // if (!item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        const endDate = new Date(item.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time

        if (periodFilter === 'ONGOING') {
            // End Date >= Today
            return endDate >= today;
        }
        if (periodFilter === 'INCOMPLETE') {
            // End Date < Today AND Count < Total (Has unpaid households)
            return endDate < today && (item.count < item.total);
        }

        return true;
    });

    // Fee Detail Modal
    const [feeDetailDialogOpen, setFeeDetailDialogOpen] = useState(false);
    const [selectedFeeDetails, setSelectedFeeDetails] = useState([]);

    const handleViewFeeDetails = (row) => {
        if (row.feeDetails && row.feeDetails.length > 0) {
            const priority = {
                building_fee: 1,
                'Phí quản lý dịch vụ chung cư': 1,
                'Tiền điện': 2,
                'Tiền nước': 3,
                'Tiền Internet': 4,
                'Phí gửi xe máy': 5,
                'Phí gửi ô tô': 6
            };
            const sorted = [...row.feeDetails].sort((a, b) => {
                const pA = priority[a.description] || 99;
                const pB = priority[b.description] || 99;
                return pA - pB;
            });
            setSelectedFeeDetails(sorted);
            setFeeDetailDialogOpen(true);
        } else {
            setSnackbar({ open: true, message: 'Không có thông tin chi tiết', severity: 'info' });
        }
    };

    // --- UNPAID FEES LOOKUP ---
    const [lookupDialogOpen, setLookupDialogOpen] = useState(false);
    const [lookupHouseholdId, setLookupHouseholdId] = useState('');
    const [lookupResults, setLookupResults] = useState([]);
    const [householdList, setHouseholdList] = useState([]);
    const [isLoadingHouseholds, setIsLoadingHouseholds] = useState(false);

    const handleOpenLookup = async () => {
        setLookupDialogOpen(true);
        setLookupHouseholdId('');
        setLookupResults([]);

        // Fetch all households for dropdown if not already fetched
        setIsLoadingHouseholds(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/household`);
            const result = await response.json();
            if (result.code === 1000) {
                // Filter active households only (status === '1')
                const activeHouseholds = result.result.filter((h) => h.status === '1');
                const sorted = activeHouseholds.sort((a, b) => {
                    const numA = parseInt(a.apartment || '0', 10);
                    const numB = parseInt(b.apartment || '0', 10);
                    return numA - numB;
                });
                setHouseholdList(sorted);
            }
        } catch (e) {
            console.error('Error fetching households', e);
        } finally {
            setIsLoadingHouseholds(false);
        }
    };

    const fetchUnpaidFees = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/unpaid/${id}`);
            const result = await response.json();
            if (result.code === 1000) {
                setLookupResults(result.result);
            }
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi khi tra cứu', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLookupChange = (e) => {
        const id = e.target.value;
        setLookupHouseholdId(id);
        fetchUnpaidFees(id);
    };

    // --- HANDLERS ---
    const handlePrintReceipt = (row) => {
        const printWindow = window.open('', '_blank');

        // --- Number to Words Logic ---
        const docSo3ChuSo = (baso) => {
            const chuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
            let tram = Math.floor(baso / 100);
            let chuc = Math.floor((baso % 100) / 10);
            let donvi = baso % 10;
            let ketQua = '';

            if (tram !== 0) {
                ketQua += chuSo[tram] + ' trăm ';
                if (chuc === 0 && donvi !== 0) ketQua += ' linh ';
            }
            if (chuc !== 0 && chuc !== 1) {
                ketQua += chuSo[chuc] + ' mươi';
                if (chuc === 0 && donvi !== 0) ketQua += ' linh ';
            }
            if (chuc === 1) ketQua += ' mười';
            switch (donvi) {
                case 1:
                    if (chuc !== 0 && chuc !== 1) ketQua += ' mốt ';
                    else ketQua += chuSo[donvi];
                    break;
                case 5:
                    if (chuc === 0) ketQua += chuSo[donvi];
                    else ketQua += ' lăm ';
                    break;
                default:
                    if (donvi !== 0) ketQua += ' ' + chuSo[donvi];
                    break;
            }
            return ketQua;
        };

        const docTienBangChu = (SoTien) => {
            if (SoTien === 0) return 'Không đồng';
            let lan = 0;
            let i = 0;
            let so = 0;
            let KetQua = '';
            let tmp = '';
            let ViTri = [];
            const Tien = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

            if (SoTien < 0) return 'Số tiền âm';
            if (SoTien > 0) {
                so = SoTien;
            } else {
                so = -SoTien;
            }
            if (SoTien > 8999999999999999) return 'Số quá lớn';
            ViTri[5] = Math.floor(so / 1000000000000000);
            if (isNaN(ViTri[5])) ViTri[5] = '0';
            so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
            ViTri[4] = Math.floor(so / 1000000000000);
            if (isNaN(ViTri[4])) ViTri[4] = '0';
            so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
            ViTri[3] = Math.floor(so / 1000000000);
            if (isNaN(ViTri[3])) ViTri[3] = '0';
            so = so - parseFloat(ViTri[3].toString()) * 1000000000;
            ViTri[2] = Math.floor(so / 1000000);
            if (isNaN(ViTri[2])) ViTri[2] = '0';
            so = so - parseFloat(ViTri[2].toString()) * 1000000;
            ViTri[1] = Math.floor(so / 1000);
            if (isNaN(ViTri[1])) ViTri[1] = '0';
            so = so - parseFloat(ViTri[1].toString()) * 1000;
            ViTri[0] = Math.floor(so);
            if (isNaN(ViTri[0])) ViTri[0] = '0';
            if (ViTri[5] > 0) lan = 5;
            else if (ViTri[4] > 0) lan = 4;
            else if (ViTri[3] > 0) lan = 3;
            else if (ViTri[2] > 0) lan = 2;
            else if (ViTri[1] > 0) lan = 1;
            else lan = 0;
            for (i = lan; i >= 0; i--) {
                tmp = docSo3ChuSo(ViTri[i]);
                KetQua += tmp;
                if (ViTri[i] > 0) KetQua += Tien[i];
                if (i > 0 && tmp.length > 0) KetQua += ',';
            }
            if (KetQua.substring(KetQua.length - 1) === ',') {
                KetQua = KetQua.substring(0, KetQua.length - 1);
            }
            KetQua = KetQua.trim();
            KetQua = KetQua.charAt(0).toUpperCase() + KetQua.slice(1);
            return KetQua + ' đồng chẵn';
        };
        // -----------------------------

        // Calculate specific amounts for all fee types
        const details = row.feeDetails || [];
        let phiDichVu = 0;
        let phiQuanLy = 0;
        let phiXeMay = 0;
        let phiOTo = 0;
        let tienDien = 0;
        let tienNuoc = 0;
        let tienInternet = 0;
        let phiKhac = 0;

        details.forEach((d) => {
            const desc = d.description.toLowerCase();
            const val = d.amount || 0;

            if (desc.includes('dịch vụ') || desc.includes('service fee')) phiDichVu += val;
            else if (desc.includes('quản lý') || desc.includes('management fee')) phiQuanLy += val;
            else if (desc.includes('xe máy') || desc.includes('motorbike')) phiXeMay += val;
            else if (desc.includes('ô tô') || desc.includes('car')) phiOTo += val;
            else if (desc.includes('điện') || desc.includes('electric')) tienDien += val;
            else if (desc.includes('nước') || desc.includes('water')) tienNuoc += val;
            else if (desc.includes('internet')) tienInternet += val;
            else phiKhac += val;
        });

        // RECALCULATE TOTAL AMOUNT based on details to ensure consistency
        let amount = phiDichVu + phiQuanLy + phiXeMay + phiOTo + tienDien + tienNuoc + tienInternet + phiKhac;
        const isVoluntary = editingRecord && !editingRecord.is_mandatory;
        if (isVoluntary && amount === 0) {
            amount = row.paidAmount || (row.paymentInfo ? row.paymentInfo.amount : 0);
        }

        // Helper to format currency
        const formatMoney = (val) => (val > 0 ? new Intl.NumberFormat('vi-VN').format(val) + ' đ' : '........................');

        const today = new Date();
        const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

        let reason = editingRecord?.description || 'Phí dịch vụ';
        if (reason === 'building_fee') reason = 'Phí quản lý dịch vụ chung cư';

        const statusText = row.status === 'Paid' ? 'Đã đóng' : 'Chưa đóng';

        let paymentDate = '.../.../...';
        if (row.paymentInfo && row.paymentInfo.date) {
            paymentDate = row.paymentInfo.date;
        } else if (row.paidDate || row.payment_date) {
            try {
                paymentDate = new Date(row.paidDate || row.payment_date).toLocaleDateString('vi-VN');
            } catch (e) {
                paymentDate = '.../.../...';
            }
        }

        const html = `
            <html>
            <head>
                <title>${isVoluntary ? 'Phiếu Đóng Góp' : 'Phiếu Thu'} - ${row.room}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 20px; }
                    .container { border: 1px solid #000; padding: 20px; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; position: relative; }
                    .header h2 { margin: 0; color: #cc0000; text-transform: uppercase; font-size: 24px; }
                    .header .sub-title { font-weight: bold; font-size: 16px; margin-top: 5px; }
                    .row { margin-bottom: 12px; display: flex; align-items: baseline; font-size: 16px; }
                    .label { min-width: 180px; font-weight: bold; }
                    .value { flex: 1; border-bottom: 1px dotted #000; padding-left: 10px; min-height: 20px; }
                    .checkbox-group { display: flex; flex-wrap: wrap; gap: 20px; margin: 15px 0; padding-left: 20px; }
                    .checkbox-item { display: flex; align-items: center; width: 48%; font-size: 16px; margin-bottom: 10px; }
                    .box { width: 16px; height: 16px; border: 1px solid #000; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                    .fee-amount { margin-left: auto; border-bottom: 1px dotted #999; padding-left: 5px; min-width: 100px; text-align: right; }
                    .signatures { display: flex; justify-content: space-around; margin-top: 50px; text-align: center; }
                    .sign-title { font-weight: bold; margin-bottom: 60px; text-transform: uppercase; font-size: 14px; }
                </style>
            </head>
            <body onload="window.print()">
                <div class="container">
                    <div class="header">
                        <h2>${isVoluntary ? 'PHIẾU ĐÓNG GÓP' : 'PHIẾU THU TIỀN'}</h2>
                        <div class="sub-title">(${isVoluntary ? 'CONTRIBUTION VOUCHER' : 'RECEIPT VOUCHER'})</div>
                        <div style="position: absolute; right: 0; top: 0; font-size: 14px;">Số (Serial No): <span style="color: #cc0000; font-weight: bold;">${String(row.id).padStart(6, '0')}</span></div>
                        <div style="margin-top: 5px; font-style: italic;">${dateStr}</div>
                    </div>
                    
                    <div class="row">
                        <span class="label">Họ tên người nộp tiền/ Payer:</span>
                        <span class="value">${row.name}</span>
                    </div>
                    <div class="row">
                        <span class="label">Căn hộ/ Apartment No:</span>
                        <span class="value">${row.room}</span>
                    </div>
                    <div class="row">
                        <span class="label">${isVoluntary ? 'Nội dung đóng góp/ Content:' : 'Lý do thu/ Reason to pay:'}</span>
                        <span class="value">${reason}</span>
                    </div>
                     <div class="row">
                        <span class="label">Trạng thái/ Status:</span>
                        <span class="value" style="margin-right: 20px;">${statusText}</span>
                        <span class="label" style="min-width: 100px;">Ngày đóng:</span>
                        <span class="value">${paymentDate}</span>
                    </div>
                    
                    ${!isVoluntary
                ? `
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <div class="box">${phiDichVu > 0 ? 'X' : ''}</div> 
                            <span>Phí dịch vụ:</span>
                            <span class="fee-amount">${formatMoney(phiDichVu)}</span>
                        </div>
                        <div class="checkbox-item">
                            <div class="box">${phiQuanLy > 0 ? 'X' : ''}</div> 
                            <span>Phí quản lý:</span>
                            <span class="fee-amount">${formatMoney(phiQuanLy)}</span>
                        </div>
                        
                        <div class="checkbox-item">
                            <div class="box">${phiXeMay > 0 ? 'X' : ''}</div> 
                            <span>Phí xe máy:</span>
                            <span class="fee-amount">${formatMoney(phiXeMay)}</span>
                        </div>
                        <div class="checkbox-item">
                            <div class="box">${phiOTo > 0 ? 'X' : ''}</div> 
                            <span>Phí ô tô:</span>
                            <span class="fee-amount">${formatMoney(phiOTo)}</span>
                        </div>

                        <div class="checkbox-item">
                            <div class="box">${tienDien > 0 ? 'X' : ''}</div> 
                            <span>Tiền điện:</span>
                            <span class="fee-amount">${formatMoney(tienDien)}</span>
                        </div>
                        <div class="checkbox-item">
                            <div class="box">${tienNuoc > 0 ? 'X' : ''}</div> 
                            <span>Tiền nước:</span>
                            <span class="fee-amount">${formatMoney(tienNuoc)}</span>
                        </div>
                        
                        <div class="checkbox-item">
                            <div class="box">${tienInternet > 0 ? 'X' : ''}</div> 
                            <span>Tiền Internet:</span>
                            <span class="fee-amount">${formatMoney(tienInternet)}</span>
                        </div>
                        <div class="checkbox-item">
                            <div class="box">${phiKhac > 0 ? 'X' : ''}</div> 
                            <span>Khác:</span>
                            <span class="fee-amount">${formatMoney(phiKhac)}</span>
                        </div>
                    </div>`
                : '<div style="margin-bottom: 20px;"></div>'
            }
                    
                    <div class="row">
                        <span class="label">Tổng tiền/ Amount:</span>
                        <span class="value" style="font-weight: bold;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</span>
                    </div>
                    <div class="row">
                        <span class="label">Bằng chữ/ In words:</span>
                        <span class="value" style="font-style: italic;">${docTienBangChu(amount)}</span>
                    </div>
                    <div class="row">
                        <span class="label">Ghi chú/ Note:</span>
                        <span class="value"></span>
                    </div>
                    
                    <div class="signatures">
                        <div>
                            <div class="sign-title">Người nộp tiền/ Payer</div>
                            <div style="font-style: italic;">(Ký, ghi rõ họ tên/ Signature & full name)</div>
                        </div>
                        <div>
                            <div class="sign-title">Người thu tiền/ Receiver</div>
                            <div style="font-style: italic;">(Ký, ghi rõ họ tên/ Signature & full name)</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                description: record.description,
                start_date: record.startDate || record.start_date, // Handle both cases just in case
                end_date: record.endDate || record.end_date,
                is_mandatory: record.isMandatory !== undefined ? record.isMandatory : record.is_mandatory
            });
            fetchPaymentPeriodDetails(record.payment_period_id);
            setTabValue(0);
            setFilterStatus('all');
            setDetailPage(0);
        } else {
            setEditingRecord(null);
            setFormData({
                description: 'Phí quản lý',
                start_date: '',
                end_date: '',
                is_mandatory: true
            });
            setHouseholdDetails([]);
            setTabValue(0);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDetailPage = (event, newPage) => {
        setDetailPage(newPage);
    };

    const handleChangeDetailRowsPerPage = (event) => {
        setDetailRowsPerPage(parseInt(event.target.value, 10));
        setDetailPage(0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        const isMandatory = e.target.value === 'true';
        setFormData({
            ...formData,
            is_mandatory: isMandatory,
            description: isMandatory ? 'Phí quản lý' : ''
        });
    };

    const handleSave = async () => {
        if (!formData.description) {
            setSnackbar({ open: true, message: 'Vui lòng nhập tên đợt thu!', severity: 'warning' });
            return;
        }
        if (!formData.start_date || !formData.end_date) {
            setSnackbar({ open: true, message: 'Vui lòng chọn thời gian thu!', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_URL}/payment-periods`;
            let method = 'POST';

            const payload = {
                description: formData.description,
                startDate: formData.start_date,
                endDate: formData.end_date,
                isMandatory: formData.is_mandatory
            };

            if (editingRecord) {
                url = `${import.meta.env.VITE_API_URL}/payment-periods/${editingRecord.payment_period_id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.code === 1000) {
                setSnackbar({ open: true, message: editingRecord ? 'Cập nhật thành công!' : 'Tạo mới thành công!', severity: 'success' });
                fetchPaymentPeriods();
                handleClose();
            } else {
                setSnackbar({ open: true, message: result.message || 'Có lỗi xảy ra', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Lỗi kết nối', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingRecord) return;

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/${deletingRecord.payment_period_id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.code === 1000) {
                setData(data.filter((item) => item.payment_period_id !== deletingRecord.payment_period_id));
                setSnackbar({ open: true, message: 'Đã xóa đợt thu!', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: result.message || 'Không thể xóa đợt thu', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Lỗi kết nối', severity: 'error' });
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setDeletingRecord(null);
        }
    };

    const handleOpenPayModal = (household) => {
        setTargetHousehold(household);
        setPaymentMethod('Tiền mặt');
        setPayModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        setLoading(true);
        try {
            const payload = {
                householdId: targetHousehold.id,
                amount: targetHousehold.required_amount,
                method: paymentMethod
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/${editingRecord.payment_period_id}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.code === 1000) {
                setHouseholdDetails((prev) => {
                    const newDetails = prev.map((h) =>
                        h.householdId === targetHousehold.id
                            ? {
                                ...h,
                                status: 'Paid',
                                paidAmount: targetHousehold.required_amount,
                                paidDate: new Date().toISOString(),
                                method: paymentMethod === 'Tiền mặt' ? 'cash' : 'transfer'
                            }
                            : h
                    );

                    try {
                        const cacheKey = 'PAYMENT_PERIOD_DETAILS_CACHE';
                        const cacheMap = JSON.parse(sessionStorage.getItem(cacheKey) || '{}');
                        cacheMap[editingRecord.payment_period_id] = newDetails;
                        sessionStorage.setItem(cacheKey, JSON.stringify(cacheMap));
                    } catch (e) {
                        console.error('Update cache error', e);
                    }

                    return newDetails;
                });

                setPayModalOpen(false);
                setTargetHousehold(null);

                // Show Snackbar after delay to ensure UI updates first
                setTimeout(() => {
                    setSnackbar({ open: true, message: `Thu tiền thành công!`, severity: 'success' });
                }, 500);

                // Fetch in background to confirm/sync
                fetchPaymentPeriodDetails(editingRecord.payment_period_id);
                fetchPaymentPeriods();
            } else {
                setSnackbar({ open: true, message: result.message || 'Lỗi', severity: 'error' });
            }
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi kết nối', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddDonation = async () => {
        if (!donationData.household_id || !donationData.amount) {
            setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin!', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            // household_id is from Selection, which uses ID (101 etc).
            const payload = {
                householdId: donationData.household_id,
                amount: Number(donationData.amount),
                method: donationData.method
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/${editingRecord.payment_period_id}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.code === 1000) {
                setSnackbar({ open: true, message: 'Thêm đóng góp thành công!', severity: 'success' });
                setDonationModalOpen(false);
                setDonationData({ household_id: '', amount: '', method: 'Tiền mặt' });
                fetchPaymentPeriodDetails(editingRecord.payment_period_id);
                fetchPaymentPeriods();
            } else {
                setSnackbar({ open: true, message: result.message || 'Lỗi', severity: 'error' });
            }
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi kết nối', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = (data, filename, periodInfo) => {
        const periodName = periodInfo ? getFeeName(periodInfo.description) : 'Danh sách';
        const sDate = periodInfo ? periodInfo.start_date || periodInfo.startDate : '';
        const eDate = periodInfo ? periodInfo.end_date || periodInfo.endDate : '';
        const typeStr = periodInfo ? (periodInfo.is_mandatory || periodInfo.isMandatory ? 'Bắt buộc' : 'Tự nguyện') : '';

        // Format dates
        const formatDate = (d) => (d ? d.split('T')[0].split('-').reverse().join('/') : '...');
        const timeStr = `Từ ngày ${formatDate(sDate)} đến ngày ${formatDate(eDate)}`;
        const colSpan = periodInfo && (periodInfo.is_mandatory || periodInfo.isMandatory) ? 17 : 6;

        let table = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
            <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                        <x:Name>Danh sách thu phí</x:Name>
                        <x:WorksheetOptions>
                            <x:DisplayGridlines/>
                        </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                </x:ExcelWorksheets>
            </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; }
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #366092; color: #ffffff !important; font-weight: bold; padding: 10px; border: 1px solid #95b3d7; text-align: center; vertical-align: middle; }
                td { padding: 5px; border: 1px solid #95b3d7; vertical-align: middle; color: #333333; }
                .text { mso-number-format:"\@"; }
                .number { mso-number-format:"0"; text-align: center; }
                .money { mso-number-format:"\#\,\#\#0"; text-align: right; }
                .title { font-size: 20px; font-weight: bold; color: #366092; text-align: center; border: none; background: #ffffff; padding: 15px; }
                .subtitle { font-size: 14px; color: #333333; text-align: center; border: none; background: #ffffff; padding-bottom: 10px; }
            </style>
        </head>
        <body>
        <table border="1">
            <thead>
                <tr>
                    <th colspan="${colSpan}" class="title">${periodName.toUpperCase()}</th>
                </tr>
                <tr>
                    <th colspan="${colSpan}" class="subtitle">
                        Thời gian: ${timeStr} | Loại: <span style="color: ${periodInfo && (periodInfo.is_mandatory || periodInfo.isMandatory) ? '#d32f2f' : '#2e7d32'}; font-weight: bold;">${typeStr}</span>
                    </th>
                </tr>
                <tr>
                    <th colspan="${colSpan}" style="border: none; background: white; height: 10px;"></th>
                </tr>
                <tr style="height: 40px;">
                    ${periodInfo && !periodInfo.is_mandatory
                ? `
                        <th style="background-color: #366092; color: white;">STT</th>
                        <th style="background-color: #366092; color: white;">Chủ Hộ</th>
                        <th style="background-color: #366092; color: white;">Phòng</th>
                        <th style="background-color: #366092; color: white;">Số Tiền Đóng Góp</th>
                        <th style="background-color: #366092; color: white;">Ngày Đóng</th>
                        <th style="background-color: #366092; color: white;">Hình thức</th>
                    `
                : `
                        <th rowspan="2" style="background-color: #366092; color: white;">STT</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Chủ Hộ</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Phòng</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Diện Tích (m2)</th>
                        <th colspan="8" style="background-color: #244061; color: white;">Chi Tiết Các Khoản Phí</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Tổng Phải Thu</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Đã Đóng</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Ngày Đóng</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Hình thức</th>
                        <th rowspan="2" style="background-color: #366092; color: white;">Trạng Thái</th>
                    `
            }
                </tr>
                ${periodInfo && !periodInfo.is_mandatory
                ? ''
                : `
                <tr style="height: 30px;">
                    <th style="background-color: #4f81bd; color: white;">Phí Dịch Vụ</th>
                    <th style="background-color: #4f81bd; color: white;">Phí Quản Lý</th>
                    <th style="background-color: #4f81bd; color: white;">Phí Xe Máy</th>
                    <th style="background-color: #4f81bd; color: white;">Phí Ô tô</th>
                    <th style="background-color: #4f81bd; color: white;">Tiền Điện</th>
                    <th style="background-color: #4f81bd; color: white;">Tiền Nước</th>
                    <th style="background-color: #4f81bd; color: white;">Tiền Internet</th>
                    <th style="background-color: #4f81bd; color: white;">Khác</th>
                </tr>`
            }
            </thead>
            <tbody>`;

        data.forEach((row, index) => {
            // Calculate detailed fees
            const details = row.feeDetails || [];
            let phiDichVu = 0,
                phiQuanLy = 0,
                phiXeMay = 0,
                phiOTo = 0;
            let tienDien = 0,
                tienNuoc = 0,
                tienInternet = 0,
                phiKhac = 0;

            details.forEach((d) => {
                const desc = d.description.toLowerCase();
                const val = d.amount || 0;

                if (desc.includes('dịch vụ') || desc.includes('service fee')) phiDichVu += val;
                else if (desc.includes('quản lý') || desc.includes('management fee')) phiQuanLy += val;
                else if (desc.includes('xe máy') || desc.includes('motorbike')) phiXeMay += val;
                else if (desc.includes('ô tô') || desc.includes('car')) phiOTo += val;
                else if (desc.includes('điện') || desc.includes('electric')) tienDien += val;
                else if (desc.includes('nước') || desc.includes('water')) tienNuoc += val;
                else if (desc.includes('internet')) tienInternet += val;
                else phiKhac += val;
            });

            // Method Logic
            let methodStr =
                row.paymentInfo && row.paymentInfo.method
                    ? row.paymentInfo.method
                    : row.method === 'cash'
                        ? 'Tiền mặt'
                        : row.method === 'transfer'
                            ? 'Chuyển khoản'
                            : row.method;

            // Fallback: If Paid but no method, assume Cash or show 'Chưa rõ'
            if (row.status === 'Paid' && !methodStr) {
                methodStr = 'Tiền mặt';
            }

            const methodDisplay = methodStr || '';

            // Area Fallback Logic
            let displayArea = row.area;
            if (!displayArea || displayArea === 0) {
                const feeWithArea = details.find(
                    (d) =>
                        d.description.toLowerCase().includes('dịch vụ') ||
                        d.description.toLowerCase().includes('service') ||
                        d.description.toLowerCase().includes('quản lý') ||
                        d.description.toLowerCase().includes('management')
                );
                if (feeWithArea && feeWithArea.unit) {
                    const parsed = parseFloat(feeWithArea.unit.replace(/[^0-9.]/g, ''));
                    if (!isNaN(parsed)) displayArea = parsed;
                }
            }

            if (periodInfo && !periodInfo.is_mandatory) {
                table += `<tr>
                    <td class="number">${index + 1}</td>
                    <td class="text">${row.householdName || ''}</td>
                    <td class="text">${row.room || ''}</td>
                    <td class="money">${row.paidAmount || 0}</td>
                    <td class="text" style="text-align: center;">${row.paymentInfo && row.paymentInfo.date
                        ? row.paymentInfo.date
                        : row.paidDate
                            ? new Date(row.paidDate).toLocaleDateString('vi-VN')
                            : ''
                    }</td>
                    <td class="text">${methodDisplay}</td>
                </tr>`;
            } else {
                table += `<tr>
                    <td class="number">${index + 1}</td>
                    <td class="text">${row.householdName || ''}</td>
                    <td class="text">${row.room || ''}</td>
                    <td class="number">${displayArea || 0}</td>
                    
                    <td class="money">${phiDichVu || 0}</td>
                    <td class="money">${phiQuanLy || 0}</td>
                    <td class="money">${phiXeMay || 0}</td>
                    <td class="money">${phiOTo || 0}</td>
                    <td class="money">${tienDien || 0}</td>
                    <td class="money">${tienNuoc || 0}</td>
                    <td class="money">${tienInternet || 0}</td>
                    <td class="money">${phiKhac || 0}</td>
                    
                    <td class="money" style="font-weight: bold;">${row.requiredAmount || 0}</td>
                    <td class="money">${row.paidAmount || 0}</td>
                    <td class="text" style="text-align: center;">${row.paymentInfo && row.paymentInfo.date
                        ? row.paymentInfo.date
                        : row.paidDate
                            ? new Date(row.paidDate).toLocaleDateString('vi-VN')
                            : ''
                    }</td>
                    <td class="text">${methodDisplay}</td>
                    <td class="text" style="color: ${row.status === 'Paid' ? 'green' : 'red'}; font-weight: bold;">
                        ${row.status === 'Paid' ? 'Đã đóng' : 'Chưa đóng'}
                    </td>
                </tr>`;
            }
        });

        table += `</tbody></table></body></html>`;

        const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        // Change extension to .xls so Excel opens it as HTML-Excel correctly without much fuss (though warning exists)
        link.setAttribute('download', filename.replace('.csv', '.xls'));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportDetailList = () => {
        const list = getHouseholdStatusList();
        const feeName = getFeeName(editingRecord.description).replace(/\s+/g, '_');
        exportToExcel(list, `Chi_tiet_${feeName}_${new Date().toISOString().slice(0, 10)}.xls`, editingRecord);
    };

    const handleExportBill = async (record) => {
        // If inside modal (editingRecord exists and matches), export current view
        if (editingRecord && editingRecord.payment_period_id === record.payment_period_id) {
            handleExportDetailList();
            return;
        }

        const feeName = getFeeName(record.description).replace(/\s+/g, '_');

        // If from Row Action, fetch details first
        setSnackbar({ open: true, message: `Đang chuẩn bị file: ${getFeeName(record.description)}...`, severity: 'info' });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/${record.payment_period_id}/details`);
            const result = await response.json();
            if (result.code === 1000) {
                let list = result.result.map((hh) => ({
                    ...hh,
                    id: hh.householdId,
                    name: hh.householdName,
                    required_amount: hh.requiredAmount,
                    status: hh.status
                    // Note: Ensure feeDetails exists in backend response
                }));
                // Filter for Voluntary when exporting from Row Action
                if (record && !record.is_mandatory) {
                    list = list.filter((h) => h.status === 'Paid');
                }
                exportToExcel(list, `Chi_tiet_${feeName}.xls`, record);
                setSnackbar({ open: true, message: 'Xuất file thành công!', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: 'Không tải được dữ liệu', severity: 'error' });
            }
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi kết nối', severity: 'error' });
        }
    };

    // --- HELPERS ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getHouseholdStatusList = () => {
        if (!editingRecord) return [];

        // Determine list based on API details
        let list = householdDetails
            .map((hh) => ({
                ...hh,
                id: hh.householdId,
                name: hh.householdName,
                required_amount: hh.requiredAmount,
                // paymentInfo used for detail modal
                paymentInfo:
                    hh.status === 'Paid'
                        ? {
                            household_name: hh.householdName,
                            householdId: hh.householdId,
                            date: hh.paidDate ? hh.paidDate.split('T')[0].split('-').reverse().join('-') : '',
                            method: hh.method === 'cash' ? 'Tiền mặt' : hh.method,
                            amount: hh.paidAmount
                        }
                        : null
            }))
            .sort((a, b) => {
                const roomA = a.room || '';
                const roomB = b.room || '';
                return roomA.toString().localeCompare(roomB.toString(), undefined, { numeric: true });
            });

        // If Voluntary, ONLY show Paid households in the list
        if (!editingRecord.is_mandatory) {
            return list.filter((item) => item.status === 'Paid');
        }

        if (filterStatus === 'paid') return list.filter((item) => item.status === 'Paid');
        if (filterStatus === 'unpaid') return list.filter((item) => item.status === 'Unpaid');
        return list;
    };

    const getFeeName = (description) => {
        if (!description) return '';

        // Handle exact matches
        const map = {
            building_fee: 'Phí quản lý dịch vụ chung cư',
            apartment_service_fee: 'Phí dịch vụ chung cư',
            apartment_management_fee: 'Phí quản lý chung cư',
            motorbike_parking_fee: 'Phí gửi xe máy',
            car_parking_fee: 'Phí gửi ô tô'
        };
        if (map[description]) return map[description];

        // Handle dynamic strings from Trigger
        let translated = description;
        translated = translated.replace('Service Fee', 'Phí dịch vụ');
        translated = translated.replace('Management Fee', 'Phí quản lý');
        translated = translated.replace('Motorbike Parking Fee', 'Phí gửi xe máy');
        translated = translated.replace('Car Parking Fee', 'Phí gửi ô tô');

        return translated;
    };

    const getUnitName = (unit) => {
        if (!unit) return '-';
        const lowerUnit = unit.toLowerCase();

        // Normalization map
        if (lowerUnit.includes('sqm') || lowerUnit.includes('m2')) return 'm²';
        if (lowerUnit.includes('vehicle')) return 'xe';
        if (lowerUnit.includes('kwh')) return 'kWh';
        if (lowerUnit.includes('m3')) return 'm³';
        if (lowerUnit.includes('goi') || lowerUnit.includes('gói')) return 'Gói';

        // Generic fallback: Try to remove leading numbers and spaces (e.g. "424 abc" -> "abc")
        const stripped = unit.replace(/^[0-9.\s]+/, '');
        return stripped || unit;
    };

    const getTypeChip = (isMandatory) => {
        return isMandatory ? (
            <Chip
                label="Bắt buộc"
                size="small"
                sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 500, minWidth: 80, justifyContent: 'center' }}
            />
        ) : (
            <Chip
                label="Tự nguyện"
                size="small"
                sx={{ bgcolor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', fontWeight: 500, minWidth: 80, justifyContent: 'center' }}
            />
        );
    };

    const handleImportClick = () => {
        if (!formData.start_date || !formData.end_date) {
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập Ngày bắt đầu và Ngày kết thúc trước khi Import!',
                severity: 'warning'
            });
            return;
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImportExcel = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validation: Require dates
        if (!formData.start_date || !formData.end_date) {
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập Ngày bắt đầu và Ngày kết thúc trước khi Import!',
                severity: 'warning'
            });
            event.target.value = null; // Reset input
            return;
        }

        setLoading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        // Prepare parameters
        // REVERTED to original simple logic as per user request
        const isMandatory = formData.is_mandatory === 'true' || formData.is_mandatory === true;
        const description = isMandatory ? 'building_fee' : formData.description || 'Đợt thu phí';

        // NEW WORKFLOW:
        // 1. Create Payment Period First to get ID
        // 2. Import Data using that ID

        try {
            // Step 1: Create Period
            const createPayload = {
                description: description,
                startDate: formData.start_date,
                endDate: formData.end_date,
                isMandatory: isMandatory
            };

            const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createPayload)
            });
            const createResult = await createResponse.json();

            if (createResult.code !== 1000) {
                throw new Error(createResult.message || 'Không thể tạo đợt thu mới');
            }

            const newPeriodId = createResult.result.paymentPeriodId || createResult.result.payment_period_id;

            // Step 2: Import using ID
            uploadData.append('description', description);
            uploadData.append('startDate', formData.start_date);
            uploadData.append('endDate', formData.end_date);
            uploadData.append('isMandatory', isMandatory);
            uploadData.append('paymentPeriodId', newPeriodId); // NEW PARAM

            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-periods/import`, {
                method: 'POST',
                body: uploadData
            });
            const result = await response.json();

            if (result.code === 1000) {
                setSnackbar({ open: true, message: 'Tạo đợt thu và nhập dữ liệu thành công!', severity: 'success' });
                fetchPaymentPeriods();
                setOpen(false);
            } else {
                setSnackbar({ open: true, message: result.message || 'Lỗi nhập dữ liệu', severity: 'error' });
            }
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi: ' + e.message, severity: 'error' });
        } finally {
            setLoading(false);
            event.target.value = null; // Reset input
        }
    };

    const handleFeeChange = (index, field, value) => {
        const newFees = [...selectedFeeDetails];
        const fee = { ...newFees[index] };

        // Update field
        fee[field] = value;

        // Recalculate amount dynamically
        if (fee.quantity && fee.unitPrice) {
            fee.amount = fee.quantity * fee.unitPrice;
        }

        newFees[index] = fee;
        setSelectedFeeDetails(newFees);
    };

    const handleSaveFee = async (fee) => {
        if (!fee.feeId) return;
        setLoading(true); // Minimal loading effect
        try {
            const response = await fetch(`http://localhost:8081/payment-periods/fees/${fee.feeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity: fee.quantity,
                    unitPrice: fee.unitPrice
                })
            });
            const result = await response.json();
            if (result.code === 1000) {
                setSnackbar({ open: true, message: 'Cập nhật phí thành công!', severity: 'success' });
                // Refresh main data
                if (editingRecord) {
                    fetchPaymentPeriodDetails(editingRecord.payment_period_id);
                }
            } else {
                setSnackbar({ open: true, message: result.message || 'Lỗi cập nhật', severity: 'error' });
            }
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi kết nối', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Đợt thu phí
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => handleOpen()}
                        sx={{ borderRadius: '8px', textTransform: 'none', px: 2, height: 40 }}
                    >
                        Thêm đợt thu
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Search size={18} />}
                        onClick={handleOpenLookup}
                        sx={{ borderRadius: '8px', textTransform: 'none', px: 2, height: 40 }}
                    >
                        Tra cứu nợ
                    </Button>
                </Stack>

                <ToggleButtonGroup
                    value={periodFilter}
                    exclusive
                    onChange={(e, v) => v && setPeriodFilter(v)}
                    size="small"
                    sx={{ height: 40 }}
                >
                    <ToggleButton value="ALL">Tất cả</ToggleButton>
                    <ToggleButton value="ONGOING">Đang thu</ToggleButton>
                    <ToggleButton value="INCOMPLETE">Quá hạn & Còn nợ</ToggleButton>
                </ToggleButtonGroup>

                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        label="Từ ngày"
                        type="date"
                        value={filterStart}
                        onChange={(e) => setFilterStart(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        sx={{ width: 140, bgcolor: 'background.paper', borderRadius: 1 }}
                    />
                    <TextField
                        label="Đến ngày"
                        type="date"
                        value={filterEnd}
                        onChange={(e) => setFilterEnd(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        sx={{ width: 140, bgcolor: 'background.paper', borderRadius: 1 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => fetchPaymentPeriods(filterStart, filterEnd)}
                        startIcon={<Search size={18} />}
                        sx={{ height: 40 }}
                    >
                        Lọc
                    </Button>
                </Stack>
            </Box>
            {/* MAIN TABLE */}
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                    <TableHead
                        sx={{
                            bgcolor: 'action.hover',
                            '& .MuiTableCell-root': {
                                color: 'text.primary',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }
                        }}
                    >
                        <TableRow>
                            <TableCell width={60}>STT</TableCell>
                            <TableCell>Tên đợt thu</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell align="center">Loại phí</TableCell>
                            <TableCell align="center" width={200}>
                                Tiến độ / Tổng thu
                            </TableCell>
                            <TableCell align="center" width={180}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.payment_period_id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                        {getFeeName(row.description)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack spacing={0.5}>
                                        <Chip
                                            label={`Bắt đầu: ${row.start_date ? row.start_date.split('-').reverse().join('-') : ''}`}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}
                                        />
                                        <Chip
                                            label={`Kết thúc: ${row.end_date ? row.end_date.split('-').reverse().join('-') : ''}`}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">{getTypeChip(row.is_mandatory)}</TableCell>
                                <TableCell align="center">
                                    {row.is_mandatory ? (
                                        <Box>
                                            <Typography sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                {formatCurrency(row.collectedAmount || 0)}
                                            </Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {row.count} / {row.total} hộ
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={row.total > 0 ? (row.count / row.total) * 100 : 0}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: row.count === row.total ? '#22c55e' : '#3b82f6'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                {formatCurrency(row.collectedAmount || 0)}
                                            </Typography>
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title="Xuất danh sách">
                                            <IconButton size="small" sx={{ color: '#22c55e' }} onClick={() => handleExportBill(row)}>
                                                <Download size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xem & Sửa">
                                            <IconButton color="primary" onClick={() => handleOpen(row)} size="small">
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton
                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
                                        <CircularProgress size={20} />
                                        <Typography variant="body2" color="text.secondary">
                                            Đang tải dữ liệu...
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                                            Không tìm thấy dữ liệu
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )
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

            {/* MAIN DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{editingRecord ? 'Chi tiết Đợt thu' : 'Tạo đợt thu mới'}</DialogTitle>
                <DialogContent sx={{ position: 'relative' }}>
                    <Tabs
                        centered
                        value={tabValue}
                        onChange={(e, v) => setTabValue(v)}
                        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Thông tin chung" />
                        {editingRecord && <Tab label="Danh sách chi tiết" icon={<Users size={16} />} iconPosition="start" />}
                    </Tabs>

                    {tabValue === 0 && (
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Loại khoản thu
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="is_mandatory"
                                    value={formData.is_mandatory}
                                    onChange={handleTypeChange}
                                    size="small"
                                >
                                    <MenuItem value="true">Bắt buộc</MenuItem>
                                    <MenuItem value="false">Tự nguyện</MenuItem>
                                </TextField>
                            </Box>

                            <Box>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Tên đợt thu <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={formData.is_mandatory ? "Ví dụ: Phí quản lý, Phí gửi xe, Phí dịch vụ..." : "Nhập tên đợt thu"}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                        Ngày bắt đầu <span style={{ color: '#ef4444' }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                        Ngày kết thúc <span style={{ color: '#ef4444' }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                            </Stack>

                            {!editingRecord && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Upload size={18} />}
                                        disabled={loading}
                                        onClick={handleImportClick}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Import file điện, nước, internet
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            onChange={handleImportExcel}
                                            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        />
                                    </Button>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {tabValue === 1 && editingRecord && (
                        <Box>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        {editingRecord.is_mandatory ? (
                                            <ToggleButtonGroup
                                                value={filterStatus}
                                                exclusive
                                                onChange={(e, v) => v && setFilterStatus(v)}
                                                size="small"
                                            >
                                                <ToggleButton value="all">Tất cả</ToggleButton>
                                                <ToggleButton value="paid">Đã đóng</ToggleButton>
                                                <ToggleButton value="unpaid">Chưa đóng</ToggleButton>
                                            </ToggleButtonGroup>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                startIcon={<Plus size={16} />}
                                                onClick={() => setDonationModalOpen(true)}
                                            >
                                                Thêm người đóng
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            startIcon={<Download size={16} />}
                                            onClick={() => handleExportBill(editingRecord)}
                                        >
                                            Xuất Excel
                                        </Button>
                                    </Stack>

                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                                <TableRow>
                                                    <TableCell>Phòng</TableCell>
                                                    <TableCell>Chủ hộ</TableCell>
                                                    <TableCell align="right">
                                                        {editingRecord.is_mandatory ? 'Số tiền quy định' : 'Số tiền đóng'}
                                                    </TableCell>
                                                    <TableCell align="center">Trạng thái</TableCell>
                                                    <TableCell align="center">In</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {getHouseholdStatusList()
                                                    .slice(
                                                        detailPage * detailRowsPerPage,
                                                        detailPage * detailRowsPerPage + detailRowsPerPage
                                                    )
                                                    .map((row) => (
                                                        <TableRow key={row.id} hover>
                                                            <TableCell>
                                                                <Chip
                                                                    label={row.room}
                                                                    size="small"
                                                                    sx={{ bgcolor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell align="right">
                                                                {editingRecord.is_mandatory ? (
                                                                    <Typography
                                                                        onClick={() => handleViewFeeDetails(row)}
                                                                        sx={{
                                                                            color: '#60a5fa',
                                                                            fontWeight: 600,
                                                                            cursor: 'pointer',
                                                                            textDecoration: 'underline',
                                                                            '&:hover': {
                                                                                color: '#3b82f6'
                                                                            }
                                                                        }}
                                                                    >
                                                                        {formatCurrency(row.required_amount)}
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography sx={{ fontWeight: 600 }}>
                                                                        {formatCurrency(
                                                                            row.paymentInfo ? row.paymentInfo.amount : row.paidAmount || 0
                                                                        )}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {row.status === 'Paid' ? (
                                                                    <Tooltip title="Xem chi tiết">
                                                                        <Chip
                                                                            icon={<CheckCircle size={14} />}
                                                                            label="Đã đóng"
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: 'rgba(34, 197, 94, 0.15)',
                                                                                color: '#22c55e',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => {
                                                                                setViewPaymentDetail(row.paymentInfo);
                                                                                setDetailModalOpen(true);
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                ) : (
                                                                    <Chip
                                                                        icon={<XCircle size={14} />}
                                                                        label="Chưa đóng"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: 'rgba(239, 68, 68, 0.15)',
                                                                            color: '#ef4444',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => handleOpenPayModal(row)}
                                                                    />
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton size="small" onClick={() => handlePrintReceipt(row)}>
                                                                    <Printer size={16} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        component="div"
                                        count={getHouseholdStatusList().length}
                                        rowsPerPage={detailRowsPerPage}
                                        page={detailPage}
                                        onPageChange={handleChangeDetailPage}
                                        onRowsPerPageChange={handleChangeDetailRowsPerPage}
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
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                    <Box />

                    <Box>
                        <Button onClick={handleClose} color="error" disabled={loading} sx={{ mr: 1 }}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Đang xử lý...' : editingRecord ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* PAY MODAL */}
            <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận thu tiền</DialogTitle>
                <DialogContent sx={{ position: 'relative' }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Tên chủ hộ
                            </Typography>
                            <TextField fullWidth value={targetHousehold?.name || ''} disabled size="small" />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Số tiền cần thu
                            </Typography>
                            <TextField
                                fullWidth
                                value={targetHousehold ? formatCurrency(targetHousehold.required_amount) : ''}
                                disabled
                                size="small"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Hình thức
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                                <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                            </TextField>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setPayModalOpen(false)} color="error" disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmPayment}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận Đã Thu'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DONATION MODAL */}
            <Dialog open={donationModalOpen} onClose={() => setDonationModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Thêm đóng góp mới</DialogTitle>
                <DialogContent sx={{ position: 'relative' }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Chọn hộ đóng góp <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={donationData.household_id}
                                onChange={(e) => setDonationData({ ...donationData, household_id: e.target.value })}
                                size="small"
                            >
                                {householdDetails
                                    .filter((h) => h.status !== 'Paid')
                                    .map((h) => (
                                        <MenuItem key={h.householdId} value={h.householdId}>
                                            {h.householdName} - {h.room}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Số tiền đóng góp <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Nhập số tiền"
                                value={donationData.amount}
                                onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                                size="small"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Hình thức
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={donationData.method}
                                onChange={(e) => setDonationData({ ...donationData, method: e.target.value })}
                                size="small"
                            >
                                <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                                <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                            </TextField>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDonationModalOpen(false)} color="error" disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleAddDonation}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* FEE DETAIL DIALOG */}
            <Dialog open={feeDetailDialogOpen} onClose={() => setFeeDetailDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết các khoản phí</DialogTitle>
                <DialogContent>
                    <TableContainer sx={{ mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell>Khoản phí</TableCell>
                                    <TableCell align="center" width={100}>
                                        SL
                                    </TableCell>
                                    <TableCell align="center">Đơn vị</TableCell>
                                    <TableCell align="right" width={140}>
                                        Đơn giá
                                    </TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                    <TableCell align="center" width={50}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedFeeDetails.map((fee, index) => {
                                    const isEditable = ['Tiền điện', 'Tiền nước', 'Tiền Internet'].includes(fee.description);
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{getFeeName(fee.description)}</TableCell>
                                            <TableCell align="center">
                                                {isEditable ? (
                                                    <OutlinedInput
                                                        size="small"
                                                        value={fee.quantity}
                                                        onChange={(e) => handleFeeChange(index, 'quantity', e.target.value)}
                                                        type="number"
                                                        sx={{ width: 80, '& input': { p: 0.5, textAlign: 'center' } }}
                                                    />
                                                ) : (
                                                    fee.quantity || '-'
                                                )}
                                            </TableCell>
                                            <TableCell align="center">{getUnitName(fee.unit)}</TableCell>
                                            <TableCell align="right">
                                                {isEditable ? (
                                                    <OutlinedInput
                                                        size="small"
                                                        value={fee.unitPrice}
                                                        onChange={(e) => handleFeeChange(index, 'unitPrice', e.target.value)}
                                                        type="number"
                                                        sx={{ width: 120, '& input': { p: 0.5, textAlign: 'right' } }}
                                                    />
                                                ) : (
                                                    formatCurrency(fee.unitPrice)
                                                )}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(fee.amount)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {isEditable && (
                                                    <IconButton size="small" onClick={() => handleSaveFee(fee)} color="primary">
                                                        <Save size={18} />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {selectedFeeDetails.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setFeeDetailDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* DETAIL MODAL (Existing Transaction Detail) */}
            <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Chi tiết giao dịch</DialogTitle>
                <DialogContent>
                    {viewPaymentDetail && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Chủ hộ
                                </Typography>
                                <Typography fontWeight={600}>{viewPaymentDetail.household_name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Số tiền
                                </Typography>
                                <Typography sx={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}>
                                    {formatCurrency(viewPaymentDetail.amount)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Ngày đóng
                                </Typography>
                                <Typography>{viewPaymentDetail.date}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Hình thức
                                </Typography>
                                <Typography>{viewPaymentDetail.method}</Typography>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                    <Button color="error" onClick={() => setRevertDialogOpen(true)}>
                        Hủy đã đóng
                    </Button>
                    <Button onClick={() => setDetailModalOpen(false)} variant="outlined">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận xóa đợt thu</DialogTitle>
                <DialogContent sx={{ position: 'relative' }}>
                    <Typography>
                        Bạn có chắc chắn muốn xóa đợt thu <strong>{getFeeName(deletingRecord?.description)}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Đang xử lý...' : 'Xóa'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* UNPAID FEES LOOKUP DIALOG */}
            <Dialog open={lookupDialogOpen} onClose={() => setLookupDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Tra cứu công nợ theo hộ gia đình</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label={isLoadingHouseholds ? 'Đang tải danh sách...' : 'Chọn hộ gia đình'}
                            value={lookupHouseholdId}
                            onChange={handleLookupChange}
                            size="small"
                            disabled={isLoadingHouseholds}
                            InputProps={{
                                startAdornment: isLoadingHouseholds ? (
                                    <InputAdornment position="start">
                                        <CircularProgress size={20} />
                                    </InputAdornment>
                                ) : null
                            }}
                        >
                            {householdList.map((h) => (
                                <MenuItem key={h.householdId} value={h.householdId}>
                                    Phòng {h.apartment} - {h.headOfHouseholdName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        lookupHouseholdId && (
                            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell>Đợt thu phí</TableCell>
                                            <TableCell>Thời gian</TableCell>
                                            <TableCell align="right">Số tiền nợ</TableCell>
                                            <TableCell align="center">Chi tiết</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lookupResults.map((row) => (
                                            <TableRow key={row.paymentPeriodId}>
                                                <TableCell>
                                                    <Typography fontWeight={600}>{getFeeName(row.paymentPeriodName)}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {row.startDate && Array.isArray(row.startDate)
                                                        ? [...row.startDate]
                                                            .reverse()
                                                            .map((d) => String(d).padStart(2, '0'))
                                                            .join('/')
                                                        : row.startDate
                                                            ? String(row.startDate).split('-').reverse().join('/')
                                                            : ''}
                                                    {' - '}
                                                    {row.endDate && Array.isArray(row.endDate)
                                                        ? [...row.endDate]
                                                            .reverse()
                                                            .map((d) => String(d).padStart(2, '0'))
                                                            .join('/')
                                                        : row.endDate
                                                            ? String(row.endDate).split('-').reverse().join('/')
                                                            : ''}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                    {(() => {
                                                        let end = row.endDate;
                                                        if (Array.isArray(end)) end = end.join('-');
                                                        const isOverdue = dayjs(end).isBefore(dayjs(), 'day');
                                                        return (
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: isOverdue ? '#ef4444' : 'text.primary'
                                                                }}
                                                            >
                                                                {formatCurrency(row.amount)}
                                                                {isOverdue && (
                                                                    <Typography
                                                                        component="span"
                                                                        variant="caption"
                                                                        sx={{ display: 'block', color: '#ef4444', fontWeight: 400 }}
                                                                    >
                                                                        (Quá hạn)
                                                                    </Typography>
                                                                )}
                                                            </Typography>
                                                        );
                                                    })()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedFeeDetails(row.feeDetails);
                                                            setFeeDetailDialogOpen(true);
                                                        }}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {lookupResults.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                    <Typography color="text.secondary">Không có khoản nợ nào.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {lookupResults.length > 0 && (
                                            <>
                                                <TableRow sx={{ bgcolor: 'rgba(239, 68, 68, 0.05)' }}>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 700, color: '#ef4444' }}>
                                                        Nợ quá hạn:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#ef4444' }}>
                                                        {formatCurrency(
                                                            lookupResults.reduce((acc, curr) => {
                                                                let end = curr.endDate;
                                                                if (Array.isArray(end)) end = end.join('-');
                                                                // Check if end date is before today (start of day to be safe, or just compare)
                                                                if (dayjs(end).isBefore(dayjs(), 'day')) {
                                                                    return acc + curr.amount;
                                                                }
                                                                return acc;
                                                            }, 0)
                                                        )}
                                                    </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                                                        Tổng cộng:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#ef4444', fontSize: '1.1rem' }}>
                                                        {formatCurrency(lookupResults.reduce((acc, curr) => acc + curr.amount, 0))}
                                                    </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setLookupDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* REVERT CONFIRMATION DIALOG */}
            <Dialog open={revertDialogOpen} onClose={() => setRevertDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận hủy trạng thái</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn chuyển trạng thái thu phí của hộ này thành <strong>Chưa đóng</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Lịch sử giao dịch này sẽ bị xóa.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setRevertDialogOpen(false)} variant="outlined">
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            // Optimistic update for Revert
                            setHouseholdDetails((prev) =>
                                prev.map((h) =>
                                    h.householdId === viewPaymentDetail.householdId
                                        ? {
                                            ...h,
                                            status: 'Unpaid',
                                            paidAmount: 0,
                                            paidDate: null,
                                            method: null
                                        }
                                        : h
                                )
                            );
                            setSnackbar({ open: true, message: 'Đã hủy trạng thái đóng tiền!', severity: 'success' });
                            setRevertDialogOpen(false);
                            setDetailModalOpen(false);
                            // TODO: Add actual API call here to sync with backend
                        }}
                    >
                        Xác nhận
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
                    sx={{ width: '100%', alignItems: 'center', '& .MuiAlert-action': { pt: 0, alignItems: 'center' } }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default PaymentPeriodManagement;
