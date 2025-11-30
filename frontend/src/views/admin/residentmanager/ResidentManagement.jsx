// frontend/src/views/admin/usermanager/ResidentManagement.jsx

import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    Popconfirm,
    message,
    Space,
    Tag,
    Row,
    Col,
    Tooltip
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    UserAddOutlined,
    FilterOutlined,
    SearchOutlined
} from '@ant-design/icons';
import MainCard from 'ui-component/cards/MainCard';
import dayjs from 'dayjs';

const { Option } = Select;

const ResidentManagement = () => {
    // --- 1. MOCK DATA ---
    const [data, setData] = useState([
        {
            key: 1,
            id: 1,
            full_name: 'Nguyễn Văn A',
            gender: 'male',
            date_of_birth: '15/05/1990',
            phone_number: '0987654321',
            id_number: '001090000001',
            family_role: 'Chủ hộ',
            job: 'Kỹ sư',
            household_id: 'H001'
        },
        {
            key: 2,
            id: 2,
            full_name: 'Trần Thị B',
            gender: 'female',
            date_of_birth: '20/08/1992',
            phone_number: '0901234567',
            id_number: '001092000002',
            family_role: 'Vợ',
            job: 'Giáo viên',
            household_id: 'H001'
        },
        {
            key: 3,
            id: 3,
            full_name: 'Lê Văn C (Chưa có hộ)',
            gender: 'male',
            date_of_birth: '10/10/2000',
            phone_number: '0912345678',
            id_number: '001200000003',
            family_role: 'Khác',
            job: 'Sinh viên',
            household_id: '' // Chưa có hộ
        }
    ]);

    // --- 2. STATE QUẢN LÝ UI & FILTER ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    
    // States cho bộ lọc (UC004)
    const [searchText, setSearchText] = useState('');
    const [genderFilter, setGenderFilter] = useState('ALL');
    const [householdFilter, setHouseholdFilter] = useState('ALL'); // ALL, HAS_HOUSEHOLD, NO_HOUSEHOLD
    const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, OWNER (Chủ hộ)

    const [form] = Form.useForm();

    // --- 3. XỬ LÝ TÌM KIẾM & LỌC (LOGIC QUAN TRỌNG) ---
    const filteredData = data.filter((item) => {
        // 1. Tìm kiếm text (Tên, SĐT, CCCD, Mã hộ)
        const matchText =
            item.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.phone_number.includes(searchText) ||
            item.id_number.includes(searchText) ||
            (item.household_id && item.household_id.toLowerCase().includes(searchText.toLowerCase()));

        // 2. Lọc Giới tính
        const matchGender = genderFilter === 'ALL' || item.gender === genderFilter;

        // 3. Lọc Trạng thái hộ (Đã thuộc hộ nào chưa)
        let matchHousehold = true;
        if (householdFilter === 'HAS_HOUSEHOLD') matchHousehold = !!item.household_id;
        if (householdFilter === 'NO_HOUSEHOLD') matchHousehold = !item.household_id;

        // 4. Lọc Vai trò (Có là chủ hộ không)
        const matchRole = roleFilter === 'ALL' || 
                          (roleFilter === 'OWNER' && item.family_role === 'Chủ hộ');

        return matchText && matchGender && matchHousehold && matchRole;
    });

    // --- 4. HANDLERS ---
    const showAddModal = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth, 'DD/MM/YYYY') : null
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const processedValues = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('DD/MM/YYYY') : ''
            };

            if (editingRecord) {
                // UPDATE
                const updatedData = data.map((item) =>
                    item.id === editingRecord.id ? { ...item, ...processedValues } : item
                );
                setData(updatedData);
                message.success('Cập nhật cư dân thành công!');
            } else {
                // CREATE
                const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
                setData([...data, { key: newId, id: newId, ...processedValues }]);
                message.success('Thêm cư dân mới thành công!');
            }
            setIsModalOpen(false);
        });
    };

    // Xử lý xóa (Có kiểm tra điều kiện UC004)
    const handleDelete = (record) => {
        // UC004 Constraint: Không thể xóa nếu là chủ hộ
        if (record.family_role === 'Chủ hộ') {
            message.error('Không thể xóa cư dân đang là Chủ hộ! Hãy đổi chủ hộ trước.');
            return;
        }

        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        message.success('Đã xóa cư dân');
    };

    // --- 5. CẤU HÌNH CỘT BẢNG ---
    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            align: 'center',
            render: (gender) => (
                <Tag color={gender === 'male' ? 'blue' : 'magenta'}>
                    {gender === 'male' ? 'Nam' : 'Nữ'}
                </Tag>
            )
        },
        { title: 'Ngày sinh', dataIndex: 'date_of_birth', key: 'date_of_birth' },
        { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
        { title: 'CCCD', dataIndex: 'id_number', key: 'id_number' },
        {
            title: 'Mã hộ',
            dataIndex: 'household_id',
            key: 'household_id',
            render: (text) => text ? <Tag color="geekblue">{text}</Tag> : <Tag color="default">Chưa có</Tag>
        },
        {
            title: 'Quan hệ',
            dataIndex: 'family_role',
            key: 'family_role',
            render: (role) => role === 'Chủ hộ' ? <Tag color="gold">CHỦ HỘ</Tag> : role
        },
        { title: 'Công việc', dataIndex: 'job', key: 'job' },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Sửa thông tin">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" ghost size="small" />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record)} // Truyền cả record để check chủ hộ
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <MainCard title="Quản lý Cư dân (Resident Management)">
            {/* --- TOOLBAR: BỘ LỌC & TÌM KIẾM (UC004) --- */}
            <div style={{ marginBottom: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Input
                            placeholder="Tìm tên, SĐT, CCCD..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={4}>
                        <Select 
                            defaultValue="ALL" 
                            style={{ width: '100%' }} 
                            onChange={(value) => setGenderFilter(value)}
                        >
                            <Option value="ALL">Giới tính: Tất cả</Option>
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select 
                            defaultValue="ALL" 
                            style={{ width: '100%' }} 
                            onChange={(value) => setHouseholdFilter(value)}
                        >
                            <Option value="ALL">Hộ khẩu: Tất cả</Option>
                            <Option value="HAS_HOUSEHOLD">Đã có hộ</Option>
                            <Option value="NO_HOUSEHOLD">Chưa có hộ</Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select 
                            defaultValue="ALL" 
                            style={{ width: '100%' }} 
                            onChange={(value) => setRoleFilter(value)}
                        >
                            <Option value="ALL">Vai trò: Tất cả</Option>
                            <Option value="OWNER">Chỉ xem Chủ hộ</Option>
                        </Select>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<UserAddOutlined />} onClick={showAddModal}>
                            Thêm cư dân
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                bordered
            />

            {/* --- MODAL FORM --- */}
            <Modal
                title={editingRecord ? 'Cập nhật thông tin cư dân' : 'Thêm cư dân mới'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingRecord ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                width={800}
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical">
                    {/* HÀNG 1: HỌ TÊN & NGÀY SINH */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="full_name"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="date_of_birth"
                                label="Ngày sinh"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 2: GIỚI TÍNH & SĐT */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Chọn giới tính!' }]}
                            >
                                <Select placeholder="Chọn giới tính">
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                name="phone_number"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập SĐT liên hệ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 3: MÃ HỘ & CMND */}
                    <Row gutter={16}>
                        <Col span={12}>
                            {/* YÊU CẦU: Mã hộ không bắt buộc */}
                            <Form.Item
                                name="household_id"
                                label="Mã hộ gia đình (Tùy chọn)"
                                rules={[{ required: false }]} 
                            >
                                <Input placeholder="Ví dụ: H001 (Bỏ trống nếu chưa có)" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="id_number"
                                label="Số CMND/CCCD"
                                rules={[{ required: true, message: 'Nhập số CMND/CCCD!' }]}
                            >
                                <Input placeholder="Nhập số giấy tờ tùy thân" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 4: VAI TRÒ & CÔNG VIỆC */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="family_role"
                                label="Quan hệ với chủ hộ"
                                rules={[{ required: true, message: 'Chọn quan hệ!' }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    <Option value="Chủ hộ">Chủ hộ</Option>
                                    <Option value="Vợ">Vợ</Option>
                                    <Option value="Chồng">Chồng</Option>
                                    <Option value="Con">Con</Option>
                                    <Option value="Bố mẹ">Bố mẹ</Option>
                                    <Option value="Thành viên khác">Thành viên khác</Option>
                                    <Option value="Khác">Khác (Ở ghép/Tạm trú)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* YÊU CẦU: Công việc bắt buộc */}
                            <Form.Item 
                                name="job" 
                                label="Công việc"
                                rules={[{ required: true, message: 'Vui lòng nhập công việc!' }]}
                            >
                                <Input placeholder="Nhập công việc hiện tại" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </MainCard>
    );
};

export default ResidentManagement;