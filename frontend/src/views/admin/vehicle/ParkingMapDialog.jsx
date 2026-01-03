import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Tab,
    Tabs,
    Typography,
    Stack,
    Tooltip,
    Divider,
    useTheme,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import { X, Car, Bike, Wrench, ArrowRight, ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react';
import MainCard from 'ui-component/cards/MainCard';
import { getAllVehicles } from 'api/vehicleService';
import AddVehicleFormInline from './AddVehicleFormInline';

const STATUS_COLORS = {
    empty: '#22c55e',
    registered: '#1e40af',
    maintenance: '#d97706'
};

const ROAD_COLOR = '#374151';
const ROAD_MARKING = '#9ca3af';

const ParkingThemeContext = createContext({
    roadColor: '#374151',
    borderColor: '#ffffff'
});


// Hàm tạo dữ liệu parking slots dựa trên vehicles đã đăng ký
const generateParkingData = (floor, registeredVehicles = []) => {
    const bikeSlots = [];
    const carSlots = [];
    const bikeZones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const carZones = ['J', 'K', 'L', 'M', 'N', 'O'];

    // Lọc vehicles theo tầng hầm
    const floorVehicles = registeredVehicles.filter(v => v.basementFloor === floor);

    // Debug log
    console.log(`Floor ${floor}: Found ${floorVehicles.length} vehicles`, floorVehicles);

    // Hàm normalize location: "A-1" -> "A1", "a-1" -> "A1"
    const normalizeLocation = (loc) => {
        if (!loc) return '';
        return loc.toUpperCase().replace(/-/g, '');
    };

    // Tạo set các location đã đăng ký để tra cứu nhanh
    const registeredLocations = new Set(
        floorVehicles.map(v => normalizeLocation(v.location))
    );

    // Tạo map để lưu thông tin xe theo location (normalized)
    const vehicleByLocation = {};
    floorVehicles.forEach(v => {
        if (v.location) {
            vehicleByLocation[normalizeLocation(v.location)] = v;
        }
    });

    // Tạo slots cho xe máy (zones A-I, 7 cột)
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 7; col++) {
            const zoneLetter = bikeZones[row - 1];
            const slotId = `${zoneLetter}${col}`;
            const slotIdUpper = slotId.toUpperCase();
            const vehicle = vehicleByLocation[slotIdUpper];

            bikeSlots.push({
                id: `${floor}-bike-${row}-${col}`,
                slotId: slotId,
                row: row,
                col: col,
                zone: zoneLetter,
                status: vehicle ? 'registered' : 'empty',
                type: 'bike',
                vehicleInfo: vehicle ? {
                    plateNumber: vehicle.plateNumber,
                    householdId: vehicle.householdId
                } : null
            });
        }
    }

    // Tạo slots cho ô tô (zones J-O, 5 cột)
    for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 5; col++) {
            const zoneLetter = carZones[row - 1];
            const slotId = `${zoneLetter}${col}`;
            const slotIdUpper = slotId.toUpperCase();
            const vehicle = vehicleByLocation[slotIdUpper];

            carSlots.push({
                id: `${floor}-car-${row}-${col}`,
                slotId: slotId,
                row: row,
                col: col,
                zone: zoneLetter,
                status: vehicle ? 'registered' : 'empty',
                type: 'car',
                vehicleInfo: vehicle ? {
                    plateNumber: vehicle.plateNumber,
                    householdId: vehicle.householdId
                } : null
            });
        }
    }

    return { bikeSlots, carSlots };
};

// Khởi tạo dữ liệu mặc định (trống)
const generateEmptyFloorData = () => ({
    1: generateParkingData(1, []),
    2: generateParkingData(2, []),
    3: generateParkingData(3, [])
});

const ParkingSlot = ({ slot, size = 'small', onClick }) => {
    const isSmall = size === 'small';
    const width = isSmall ? 60 : 90;
    const height = isSmall ? 44 : 68;

    const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.empty;

    // Tạo tooltip text với thông tin xe nếu có
    const getTooltipText = () => {
        if (slot.status === 'empty') {
            return `${slot.slotId} - Trống (Click để thêm xe)`;
        } else if (slot.status === 'registered' && slot.vehicleInfo) {
            return `${slot.slotId} - ${slot.vehicleInfo.plateNumber} (Hộ ${slot.vehicleInfo.householdId})`;
        } else if (slot.status === 'maintenance') {
            return `${slot.slotId} - Bảo trì`;
        }
        return `${slot.slotId} - Đã đăng ký`;
    };

    const handleClick = () => {
        if (onClick) {
            onClick(slot);
        }
    };

    return (
        <Tooltip title={getTooltipText()}>
            <Box
                onClick={handleClick}
                sx={{
                    width: width,
                    height: height,
                    bgcolor: getStatusColor(slot.status),
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: slot.status === 'empty' ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    border: '2px solid rgba(255,255,255,0.3)',
                    '&:hover': slot.status === 'empty' ? {
                        transform: 'scale(1.08)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        zIndex: 10,
                        border: '2px solid rgba(255,255,255,0.8)'
                    } : {}
                }}
            >
                {slot.status === 'maintenance' ? (
                    <Wrench size={isSmall ? 16 : 24} color="white" />
                ) : slot.type === 'bike' ? (
                    <Bike size={isSmall ? 16 : 24} color="white" />
                ) : (
                    <Car size={isSmall ? 18 : 26} color="white" />
                )}
                <Typography
                    variant="caption"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: isSmall ? '0.75rem' : '0.9rem',
                        lineHeight: 1,
                        mt: 0.5
                    }}
                >
                    {slot.slotId}
                </Typography>
            </Box>
        </Tooltip>
    );
};

const Road = ({ direction = 'horizontal', width = '100%', height = 40, showArrows = true, arrowDirection = 'right' }) => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    return (
        <Box
            sx={{
                width: direction === 'horizontal' ? width : height,
                height: direction === 'horizontal' ? height : width,
                bgcolor: roadColor,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    ...(direction === 'horizontal' ? {
                        left: '10%',
                        right: '10%',
                        height: '2px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: `repeating-linear-gradient(to right, ${ROAD_MARKING} 0px, ${ROAD_MARKING} 15px, transparent 15px, transparent 25px)`
                    } : {
                        top: '10%',
                        bottom: '10%',
                        width: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: `repeating-linear-gradient(to bottom, ${ROAD_MARKING} 0px, ${ROAD_MARKING} 15px, transparent 15px, transparent 25px)`
                    })
                }
            }}
        >
            {showArrows && (
                <Stack
                    direction={direction === 'horizontal' ? 'row' : 'column'}
                    spacing={4}
                    sx={{ color: ROAD_MARKING, opacity: 0.7 }}
                >
                    {arrowDirection === 'right' && <ArrowRight size={20} />}
                    {arrowDirection === 'down' && <ArrowDown size={20} />}
                    {arrowDirection === 'up' && <ArrowUp size={20} />}
                    {arrowDirection === 'right' && <ArrowRight size={20} />}
                    {arrowDirection === 'down' && <ArrowDown size={20} />}
                    {arrowDirection === 'up' && <ArrowUp size={20} />}
                </Stack>
            )}
        </Box>
    );
};

const ParkingRow = ({ slots, slotSize, onSlotClick }) => (
    <Stack direction="row" spacing={0.25} justifyContent="center">
        {slots.map((slot) => (
            <ParkingSlot key={slot.id} slot={slot} size={slotSize} onClick={onSlotClick} />
        ))}
    </Stack>
);

const ROAD_WIDTH = 20;
const ROAD_BORDER_COLOR = '#ffffff';
const ROAD_BORDER_WIDTH = 2;

const ZONE_WIDTHS = {
    bike: 4 + (60 * 7) + (2 * 6) + 4,
    car: 4 + (90 * 5) + (2 * 4) + 4
};

const HorizontalRoad = ({ width }) => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    return (
        <Box sx={{
            height: ROAD_WIDTH,
            bgcolor: roadColor,
            width: width ? width : 'auto',
            flex: width ? 'none' : 1,
            position: 'relative',
            boxSizing: 'border-box',
            borderTop: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderBottom: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                height: '2px',
                background: `repeating-linear-gradient(to right, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px)`
            }
        }} />
    );
};

const InnerHorizontalRoad = ({ width }) => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    return (
        <Box sx={{
            height: ROAD_WIDTH,
            bgcolor: roadColor,
            width: width || '100%',
            flex: width ? 'none' : 1,
            position: 'relative',
            boxSizing: 'border-box',
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                height: '2px',
                background: `repeating-linear-gradient(to right, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px)`
            }
        }} />
    );
};

const ZoneEntry = ({ type }) => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    const isBike = type === 'bike';

    return (
        <Box sx={{
            width: ROAD_WIDTH,
            height: ROAD_WIDTH,
            bgcolor: roadColor,
            position: 'relative',
            flexShrink: 0,
            boxSizing: 'border-box',
            borderLeft: isBike ? `${ROAD_BORDER_WIDTH}px solid ${borderColor}` : 'none',
            borderRight: !isBike ? `${ROAD_BORDER_WIDTH}px solid ${borderColor}` : 'none',
        }}>
            <svg
                width={ROAD_WIDTH}
                height={ROAD_WIDTH}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <path d="M 7 3 L 10 7 L 13 3" fill="none" stroke={borderColor} strokeWidth="2" />
                <path d="M 10 0 L 10 20" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                {isBike ? (
                    <path d="M 10 10 L 20 10" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                ) : (
                    <path d="M 10 10 L 0 10" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                )}
            </svg>
        </Box>
    );
};

const VerticalRoad = () => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    return (
        <Box sx={{
            width: ROAD_WIDTH,
            bgcolor: roadColor,
            alignSelf: 'stretch',
            position: 'relative',
            boxSizing: 'border-box',
            borderLeft: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderRight: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                background: `repeating-linear-gradient(to bottom, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px)`
            }
        }} />
    );
};

const RoadCorner = ({ position = 'top-left' }) => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    const borderStyles = {
        'top-left': {
            borderTop: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderLeft: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderTopLeftRadius: ROAD_WIDTH
        },
        'top-right': {
            borderTop: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderRight: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderTopRightRadius: ROAD_WIDTH
        },
        'bottom-left': {
            borderBottom: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderLeft: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderBottomLeftRadius: ROAD_WIDTH
        },
        'bottom-right': {
            borderBottom: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderRight: `${ROAD_BORDER_WIDTH}px solid ${borderColor}`,
            borderBottomRightRadius: ROAD_WIDTH
        }
    };

    const arcPaths = {
        'top-left': 'M 10 20 A 10 10 0 0 1 20 10',
        'top-right': 'M 0 10 A 10 10 0 0 1 10 20',
        'bottom-left': 'M 20 10 A 10 10 0 0 1 10 0',
        'bottom-right': 'M 10 0 A 10 10 0 0 1 0 10'
    };

    return (
        <Box sx={{
            width: ROAD_WIDTH,
            height: ROAD_WIDTH,
            bgcolor: roadColor,
            position: 'relative',
            flexShrink: 0,
            boxSizing: 'border-box',
            ...borderStyles[position]
        }}>
            <svg
                width={ROAD_WIDTH}
                height={ROAD_WIDTH}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <path
                    d={arcPaths[position]}
                    fill="none"
                    stroke={borderColor}
                    strokeWidth="2"
                    strokeDasharray="10 10"
                />
            </svg>
        </Box>
    );
};

const CrossRoad = () => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    return (
        <Box sx={{
            width: ROAD_WIDTH,
            height: ROAD_WIDTH,
            bgcolor: roadColor,
            position: 'relative',
            flexShrink: 0,
            boxSizing: 'border-box',
        }}>
            <svg
                width={ROAD_WIDTH}
                height={ROAD_WIDTH}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <line x1="10" y1="0" x2="10" y2="20" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                <line x1="0" y1="10" x2="20" y2="10" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
            </svg>
        </Box>
    );
};

const TIntersection = ({ direction = 'left' }) => {
    const { roadColor, borderColor } = useContext(ParkingThemeContext);
    let borderStyles = {};

    if (direction === 'left') {
        borderStyles = { borderRight: `${ROAD_BORDER_WIDTH}px solid ${borderColor}` };
    } else if (direction === 'right') {
        borderStyles = { borderLeft: `${ROAD_BORDER_WIDTH}px solid ${borderColor}` };
    } else if (direction === 'down') {
        borderStyles = { borderTop: `${ROAD_BORDER_WIDTH}px solid ${borderColor}` };
    } else if (direction === 'up') {
        borderStyles = { borderBottom: `${ROAD_BORDER_WIDTH}px solid ${borderColor}` };
    }

    return (
        <Box sx={{
            width: ROAD_WIDTH,
            height: ROAD_WIDTH,
            bgcolor: roadColor,
            position: 'relative',
            flexShrink: 0,
            boxSizing: 'border-box',
            ...borderStyles
        }}>
            <svg
                width={ROAD_WIDTH}
                height={ROAD_WIDTH}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                {direction === 'right' && (
                    <>
                        <path d="M 10 0 Q 10 10 20 10" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                        <path d="M 10 20 Q 10 10 20 10" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                    </>
                )}
                {direction === 'left' && (
                    <>
                        <path d="M 10 0 Q 10 10 0 10" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                        <path d="M 10 20 Q 10 10 0 10" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                    </>
                )}
                {direction === 'down' && (
                    <>
                        <path d="M 0 10 Q 10 10 10 20" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                        <path d="M 20 10 Q 10 10 10 20" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                    </>
                )}
                {direction === 'up' && (
                    <>
                        <path d="M 0 10 Q 10 10 10 0" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                        <path d="M 20 10 Q 10 10 10 0" fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="5 5" />
                    </>
                )}
            </svg>
        </Box>
    );
};

const BikeZone = ({ slots }) => {
    const columns = 7;
    const rows = [];
    const rowCount = Math.ceil(slots.length / columns);

    for (let i = 0; i < rowCount; i++) {
        rows.push(slots.slice(i * columns, (i + 1) * columns));
    }
    return { rows };
};

const getBikeZoneRows = (slots) => {
    const columns = 7;
    const rows = [];
    for (let i = 0; i < 9; i++) {
        rows.push(slots.slice(i * columns, (i + 1) * columns));
    }
    return {
        zoneA: rows.slice(0, 3),
        zoneB: rows.slice(3, 6),
        zoneC: rows.slice(6, 9)
    };
};

const getCarZoneRows = (slots) => {
    const columns = 5;
    const rows = [];
    for (let i = 0; i < 6; i++) {
        rows.push(slots.slice(i * columns, (i + 1) * columns));
    }
    return {
        zoneD: rows.slice(0, 2),
        zoneE: rows.slice(2, 4),
        zoneF: rows.slice(4, 6)
    };
};

const ZoneBlock = ({ rows, slotSize, onSlotClick }) => (
    <Box sx={{ bgcolor: 'background.paper', p: 0.5 }}>
        <Stack spacing={0.25}>
            {rows.map((row, idx) => (
                <ParkingRow key={idx} slots={row} slotSize={slotSize} onSlotClick={onSlotClick} />
            ))}
        </Stack>
    </Box>
);

const CarZone = ({ slots }) => {
    const columns = 5;
    const rows = [];
    const rowCount = Math.ceil(slots.length / columns);

    for (let i = 0; i < rowCount; i++) {
        rows.push(slots.slice(i * columns, (i + 1) * columns));
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Zone D: rows 0-1 */}
            <Box sx={{ p: 0.5 }}>
                <Stack spacing={0.25}>
                    {rows.slice(0, 2).map((row, idx) => (
                        <ParkingRow key={`D-${idx}`} slots={row} slotSize="large" />
                    ))}
                </Stack>
            </Box>
            <InnerHorizontalRoad />

            {/* Zone E: rows 2-3 */}
            <Box sx={{ p: 0.5 }}>
                <Stack spacing={0.25}>
                    {rows.slice(2, 4).map((row, idx) => (
                        <ParkingRow key={`E-${idx}`} slots={row} slotSize="large" />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

const EntryExit = ({ label, color, reverse = false }) => (
    <Box
        sx={{
            bgcolor: color,
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textTransform: 'uppercase'
        }}
    >
        {!reverse && (
            <Stack spacing={-0.5} alignItems="center">
                <ArrowUp size={14} strokeWidth={3} />
                <ArrowDown size={14} strokeWidth={3} />
            </Stack>
        )}
        {label}
        {reverse && (
            <Stack spacing={-0.5} alignItems="center">
                <ArrowUp size={14} strokeWidth={3} />
                <ArrowDown size={14} strokeWidth={3} />
            </Stack>
        )}
    </Box>
);

const Legend = ({ direction = 'row', ...stackProps }) => {
    const { roadColor } = useContext(ParkingThemeContext);
    return (
        <Stack
            direction={direction}
            spacing={2}
            {...stackProps}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: STATUS_COLORS.empty, borderRadius: '3px' }} />
                <Typography variant="caption" fontWeight={600} color="text.secondary">TRỐNG</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: STATUS_COLORS.registered, borderRadius: '3px' }} />
                <Typography variant="caption" fontWeight={600} color="text.secondary">ĐÃ ĐĂNG KÝ</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: roadColor, borderRadius: '3px' }} />
                <Typography variant="caption" fontWeight={600} color="text.secondary">ĐƯỜNG ĐI</Typography>
            </Stack>
        </Stack>
    );
};

const ParkingMap = ({ onBack }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const parkingTheme = {
        roadColor: isDark ? '#374151' : '#cbd5e1',
        borderColor: isDark ? '#ffffff' : '#64748b'
    };

    const [currentFloor, setCurrentFloor] = useState(0);
    const [scale, setScale] = useState(1);
    const [floorsData, setFloorsData] = useState(generateEmptyFloorData());
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const mapRef = useRef(null);

    // State for add vehicle dialog
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);

    // Handle slot click
    const handleSlotClick = (slot) => {
        if (slot.status === 'empty') {
            setSelectedSlot(slot);
            setAddVehicleDialogOpen(true);
        }
    };

    const handleCloseAddVehicleDialog = () => {
        setAddVehicleDialogOpen(false);
        setSelectedSlot(null);
    };

    // Fetch vehicles từ API
    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await getAllVehicles();
            if (response.success && response.data) {
                // Tạo dữ liệu parking cho từng tầng dựa trên vehicles
                const newFloorsData = {
                    1: generateParkingData(1, response.data),
                    2: generateParkingData(2, response.data),
                    3: generateParkingData(3, response.data)
                };
                setFloorsData(newFloorsData);
            }
        } catch (error) {
            console.error('Error fetching vehicles for parking map:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles khi component mount
    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleFloorChange = (event, newValue) => {
        setCurrentFloor(newValue);
    };

    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current && mapRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;
                const mapWidth = mapRef.current.offsetWidth;
                const mapHeight = mapRef.current.offsetHeight;

                const horizontalPadding = 48;
                const verticalPadding = 48;

                const scaleX = (containerWidth - horizontalPadding) / mapWidth;
                const scaleY = (containerHeight - verticalPadding) / mapHeight;

                const newScale = Math.min(scaleX, scaleY, 1.1);
                setScale(newScale > 0.1 ? newScale : 1);
            }
        };
        calculateScale();
        window.addEventListener('resize', calculateScale);
        const timer = setTimeout(calculateScale, 100);

        return () => {
            window.removeEventListener('resize', calculateScale);
            clearTimeout(timer);
        };
    }, [currentFloor, loading]);

    const floorData = floorsData[currentFloor + 1];

    // Loading state
    if (loading) {
        return (
            <MainCard title={false} contentSX={{ p: 0 }} border={false} elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 160px)' }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    return (
        <ParkingThemeContext.Provider value={parkingTheme}>
            <MainCard title={false} contentSX={{ p: 0 }} border={false} elevation={0} sx={{ bgcolor: 'transparent' }}>
                {/* Reduced height calc to ensure no scroll on most screens */}
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'calc(100vh - 160px)', bgcolor: 'background.default' }}>

                    {/* Left Sidebar: Back Button + Floor Tabs + Legend */}
                    <Stack
                        spacing={3}
                        sx={{
                            width: 250,
                            p: 2.5,
                            m: 3,
                            bgcolor: 'background.paper',
                            borderRadius: '20px',
                            boxShadow: 4,
                            height: 'fit-content',
                            zIndex: 10
                        }}
                    >
                        <Box>
                            <Tooltip title="Quay lại danh sách">
                                <IconButton
                                    onClick={onBack}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '12px',
                                        padding: '10px',
                                        mb: 2,
                                        bgcolor: 'background.paper',
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <ArrowLeft size={20} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="overline" sx={{ px: 1, color: 'text.secondary', display: 'block', mb: 1.5, fontWeight: 700 }}>
                                KHU VỰC
                            </Typography>
                            <Tabs
                                orientation="vertical"
                                value={currentFloor}
                                onChange={handleFloorChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        alignItems: 'flex-start',
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        textTransform: 'none',
                                        minHeight: 48,
                                        px: 2,
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.dark'
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        left: 0,
                                        width: 4,
                                        borderRadius: '0 4px 4px 0'
                                    }
                                }}
                            >
                                <Tab label="Tầng 1" />
                                <Tab label="Tầng 2" />
                                <Tab label="Tầng 3" />
                            </Tabs>
                        </Box>

                        {/* Moved Legend to Sidebar */}
                        <Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="overline" sx={{ px: 1, color: 'text.secondary', display: 'block', mb: 1, fontWeight: 700 }}>
                                CHÚ THÍCH
                            </Typography>
                            <Legend direction="column" alignItems="flex-start" />
                        </Box>
                    </Stack>

                    {/* Right Content: Main parking layout (Auto Scaled) */}
                    <Box
                        ref={containerRef}
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <Box
                            ref={mapRef}
                            sx={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'center center',
                                transition: 'transform 0.3s ease-out',
                                width: 'fit-content'
                            }}
                        >
                            <Box sx={{
                                bgcolor: parkingTheme.roadColor,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: theme.shadows[10],
                                border: `1px solid ${theme.palette.divider}`
                            }}>
                                {/* Entry/Exit indicators */}
                                <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
                                    <EntryExit label="XE MÁY" color="#22c55e" />
                                    <EntryExit label="Ô TÔ" color="#ef4444" reverse />
                                </Stack>

                                {(() => {
                                    const bikeZones = getBikeZoneRows(floorData.bikeSlots);
                                    const carZones = getCarZoneRows(floorData.carSlots);

                                    return (
                                        <>
                                            {/* Top row: Entry(Bike) + Left Road + Top T + Right Road + Entry(Car) */}
                                            <Stack direction="row" spacing={0}>
                                                <ZoneEntry type="bike" />
                                                <HorizontalRoad width={ZONE_WIDTHS.bike} />
                                                <TIntersection direction="down" />
                                                <HorizontalRoad width={ZONE_WIDTHS.car} />
                                                <ZoneEntry type="car" />
                                            </Stack>

                                            {/* Zone A row */}
                                            <Stack direction="row" spacing={0} alignItems="stretch">
                                                <VerticalRoad />
                                                <ZoneBlock rows={bikeZones.zoneA} slotSize="small" onSlotClick={handleSlotClick} />
                                                <VerticalRoad />
                                                <ZoneBlock rows={carZones.zoneD} slotSize="large" onSlotClick={handleSlotClick} />
                                                <VerticalRoad />
                                            </Stack>

                                            {/* Road row between A-B and D-E with T-intersections */}
                                            <Stack direction="row" spacing={0}>
                                                <TIntersection direction="right" />
                                                <InnerHorizontalRoad width={ZONE_WIDTHS.bike} />
                                                <CrossRoad />
                                                <InnerHorizontalRoad width={ZONE_WIDTHS.car} />
                                                <TIntersection direction="left" />
                                            </Stack>

                                            {/* Zone B row */}
                                            <Stack direction="row" spacing={0} alignItems="stretch">
                                                <VerticalRoad />
                                                <ZoneBlock rows={bikeZones.zoneB} slotSize="small" onSlotClick={handleSlotClick} />
                                                <VerticalRoad />
                                                <ZoneBlock rows={carZones.zoneE} slotSize="large" onSlotClick={handleSlotClick} />
                                                <VerticalRoad />
                                            </Stack>

                                            {/* Road row between B-C and E-F with CrossRoad in middle */}
                                            <Stack direction="row" spacing={0}>
                                                <TIntersection direction="right" />
                                                <InnerHorizontalRoad width={ZONE_WIDTHS.bike} />
                                                <CrossRoad />
                                                <InnerHorizontalRoad width={ZONE_WIDTHS.car} />
                                                <TIntersection direction="left" />
                                            </Stack>

                                            {/* Zone C and F row */}
                                            <Stack direction="row" spacing={0} alignItems="stretch">
                                                <VerticalRoad />
                                                <ZoneBlock rows={bikeZones.zoneC} slotSize="small" onSlotClick={handleSlotClick} />
                                                <VerticalRoad />
                                                <ZoneBlock rows={carZones.zoneF} slotSize="large" onSlotClick={handleSlotClick} />
                                                <VerticalRoad />
                                            </Stack>

                                            {/* Bottom row: Corner + Left Road + Bottom T + Right Road + Corner */}
                                            <Stack direction="row" spacing={0}>
                                                <RoadCorner position="bottom-left" />
                                                <HorizontalRoad width={ZONE_WIDTHS.bike} />
                                                <TIntersection direction="up" />
                                                <HorizontalRoad width={ZONE_WIDTHS.car} />
                                                <RoadCorner position="bottom-right" />
                                            </Stack>
                                        </>
                                    );
                                })()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </MainCard>

            {/* Add Vehicle Dialog */}
            <Dialog
                open={addVehicleDialogOpen}
                onClose={handleCloseAddVehicleDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {selectedSlot?.type === 'bike' ? (
                            <Bike size={24} color="#22c55e" />
                        ) : (
                            <Car size={24} color="#22c55e" />
                        )}
                        <Typography variant="h5" fontWeight={700}>
                            Thêm xe vào vị trí {selectedSlot?.slotId}
                        </Typography>
                    </Stack>
                </DialogTitle>
<DialogContent>
    <AddVehicleFormInline 
        selectedSlot={selectedSlot}
        currentFloor={currentFloor + 1}
        onSuccess={() => {
            handleCloseAddVehicleDialog();
            // Refresh parking map để hiển thị xe mới thêm
            fetchVehicles();
        }}
        onCancel={handleCloseAddVehicleDialog}
    />
</DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0 }}>
                    <Button onClick={handleCloseAddVehicleDialog} variant="outlined">
                        Đóng
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleCloseAddVehicleDialog();
                            onBack(); // Go back to vehicle list
                        }}
                    >
                        Đến trang Quản lý Phương tiện
                    </Button>
                </DialogActions>
            </Dialog>
        </ParkingThemeContext.Provider>
    );
};

export default ParkingMap;
