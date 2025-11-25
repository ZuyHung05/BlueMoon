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
    Tooltip,
    Tabs,
    Divider
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    HomeOutlined,
    TeamOutlined,
    UserAddOutlined,
    AuditOutlined
} from '@ant-design/icons';
import MainCard from 'ui-component/cards/MainCard';
import dayjs from 'dayjs';

const { Option } = Select;

const HouseholdManagement = () => {
    // --- 1. MOCK DATA ---
    const MOCK_APARTMENTS = [
        { id: 101, room_number: 'A101', area: 75, status: 1 },
        { id: 102, room_number: 'A102', area: 80, status: 1 },
        { id: 205, room_number: 'B205', area: 65, status: 0 }, // Trống
    ];

    const MOCK_RESIDENTS = [
        { id: 1, full_name: 'Nguyễn Văn A', id_number: '001090000001', gender: 'Nam' },
        { id: 2, full_name: 'Trần Thị B', id_number: '001090000002', gender: 'Nữ' },
        { id: 3, full_name: 'Lê Văn C', id_number: '001090000003', gender: 'Nam' },
        { id: 4, full_name: 'Phạm Thị D', id_number: '001090000004', gender: 'Nữ' },
    ];

    const [households, setHouseholds] = useState([
        {
            household_id: 1,
            apartment_id: 101,
            head_of_household: 1, // Nguyễn Văn A
            status: 1, // 1: Đang ở
            start_day: '2020-01-15',
            members: [
                { id: 1, full_name: 'Nguyễn Văn A', role: 'Chủ hộ', id_number: '001090000001' },
                { id: 2, full_name: 'Trần Thị B', role: 'Vợ', id_number: '001090000002' }
            ]
        },
        {
            household_id: 2,
            apartment_id: 102,
            head_of_household: 3, // Lê Văn C
            status: 1,
            start_day: '2021-05-20',
            members: [
                { id: 3, full_name: 'Lê Văn C', role: 'Chủ hộ', id_number: '001090000003' }
            ]
        }
    ]);

    // --- 2. STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    
    // State cho tab thành viên
    const [currentMembers, setCurrentMembers] = useState([]);

    // State khai báo tạm trú
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [absenceForm] = Form.useForm();

    // --- 3. HANDLERS ---
    
    const showAddModal = () => {
        setEditingRecord(null);
        setCurrentMembers([]);
        form.resetFields();
        // Mặc định ngày hôm nay
        form.setFieldsValue({ start_day: dayjs() });
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        // Load danh sách thành viên vào state tạm để thao tác
        setCurrentMembers([...record.members]);
        
        form.setFieldsValue({
            ...record,
            start_day: dayjs(record.start_day)
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Validate logic: Phải có ít nhất 1 thành viên là chủ hộ
            if (currentMembers.length === 0) {
                message.error('Hộ khẩu phải có ít nhất 1 thành viên!');
                return;
            }
            
            const processedValues = {
                ...values,
                start_day: values.start_day.format('YYYY-MM-DD'),
                members: currentMembers
            };

            if (editingRecord) {
                const updatedList = households.map((item) =>
                    item.household_id === editingRecord.household_id ? { ...item, ...processedValues } : item
                );
                setHouseholds(updatedList);
                message.success('Cập nhật hộ khẩu thành công!');
            } else {
                const newId = households.length > 0 ? Math.max(...households.map(h => h.household_id)) + 1 : 1;
                // Tự động add chủ hộ vào members nếu chưa có
                let finalMembers = [...currentMembers];
                const headInfo = MOCK_RESIDENTS.find(r => r.id === values.head_of_household);
                
                if (headInfo && !finalMembers.some(m => m.id === headInfo.id)) {
                    finalMembers.push({ ...headInfo, role: 'Chủ hộ' });
                }

                setHouseholds([...households, { ...processedValues, household_id: newId, members: finalMembers }]);
                message.success('Tạo hộ khẩu mới thành công!');
            }
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        setHouseholds(households.filter((h) => h.household_id !== id));
        message.success('Đã xóa hộ khẩu');
    };

    // --- LOGIC MEMBERS (Trong Modal) ---
    const handleAddMember = (residentId) => {
        const resident = MOCK_RESIDENTS.find(r => r.id === residentId);
        if (!resident) return;
        if (currentMembers.some(m => m.id === resident.id)) {
            message.warning('Cư dân này đã có trong hộ!');
            return;
        }
        const newMember = { ...resident, role: 'Thành viên' };
        setCurrentMembers([...currentMembers, newMember]);
    };

    const handleRemoveMember = (memberId) => {
        // UC003: Không thể xóa chủ hộ (logic lấy từ form value hiện tại)
        const currentHeadId = form.getFieldValue('head_of_household');
        if (memberId === currentHeadId) {
            message.error('Không thể xóa Chủ hộ! Hãy đổi chủ hộ trước.');
            return;
        }
        setCurrentMembers(currentMembers.filter(m => m.id !== memberId));
    };

    // --- FILTER ---
    const filteredData = households.filter((item) => {
        const apartment = MOCK_APARTMENTS.find((a) => a.id === item.apartment_id);
        const head = MOCK_RESIDENTS.find((r) => r.id === item.head_of_household);

        const matchSearch =
            (head && head.full_name.toLowerCase().includes(searchText.toLowerCase())) ||
            (head && head.id_number.includes(searchText)) ||
            (apartment && apartment.room_number.toLowerCase().includes(searchText.toLowerCase()));

        const matchStatus = statusFilter === 'ALL' || item.status === parseInt(statusFilter);

        return matchSearch && matchStatus;
    });

    // Helper render
    const getApartmentName = (id) => MOCK_APARTMENTS.find((a) => a.id === id)?.room_number || '---';
    const getHeadName = (id) => MOCK_RESIDENTS.find((r) => r.id === id)?.full_name || '---';

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Mã Hộ',
            dataIndex: 'household_id',
            width: 80,
            align: 'center',
            render: (val) => <Tag color="geekblue">H{val}</Tag>
        },
        {
            title: 'Phòng',
            dataIndex: 'apartment_id',
            render: (val) => (
                <Space><HomeOutlined style={{color: 'gray'}} /> <b>{getApartmentName(val)}</b></Space>
            )
        },
        {
            title: 'Chủ hộ',
            dataIndex: 'head_of_household',
            render: (val) => getHeadName(val)
        },
        {
            title: 'Số thành viên',
            dataIndex: 'members',
            align: 'center',
            render: (members) => <Tag color="purple">{members.length} người</Tag>
        },
        {
            title: 'Ngày vào',
            dataIndex: 'start_day',
            render: (val) => dayjs(val).format('DD/MM/YYYY')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            align: 'center',
            render: (val) => (
                <Tag color={val === 1 ? 'success' : 'default'}>
                    {val === 1 ? 'Đang ở' : 'Đã đi'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Sửa & Quản lý thành viên">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" ghost size="small" />
                    </Tooltip>
                    <Popconfirm title="Xóa hộ khẩu?" onConfirm={() => handleDelete(record.household_id)}>
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // Columns cho bảng thành viên trong Modal
    const memberColumns = [
        { title: 'Họ tên', dataIndex: 'full_name' },
        { title: 'CCCD', dataIndex: 'id_number' },
        { title: 'Vai trò', dataIndex: 'role', render: (r, rec) => rec.id === form.getFieldValue('head_of_household') ? <Tag color="gold">Chủ hộ</Tag> : r },
        { 
            title: 'Xóa', 
            key: 'del', 
            width: 60,
            render: (_, rec) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveMember(rec.id)} />
        }
    ];

    // --- MODAL CONTENT (TABS) ---
    const modalContent = (
        <Tabs defaultActiveKey="1" items={[
            {
                key: '1',
                label: <span><HomeOutlined />Thông tin chung</span>,
                children: (
                    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                         <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="apartment_id" label="Chọn Căn hộ" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn căn hộ" showSearch optionFilterProp="children">
                                        {MOCK_APARTMENTS.map(apt => (
                                            <Option key={apt.id} value={apt.id}>
                                                {apt.room_number} ({apt.area}m²) - {apt.status ? 'Đang ở' : 'Trống'}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="head_of_household" label="Chọn Chủ hộ" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn chủ hộ" showSearch optionFilterProp="children">
                                        {MOCK_RESIDENTS.map(res => (
                                            <Option key={res.id} value={res.id}>{res.full_name} ({res.id_number})</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="start_day" label="Ngày chuyển đến" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="status" label="Trạng thái" initialValue={1}>
                                    <Select>
                                        <Option value={1}>Đang sinh sống</Option>
                                        <Option value={0}>Đã chuyển đi</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )
            },
            {
                key: '2',
                label: <span><TeamOutlined />Thành viên ({currentMembers.length})</span>,
                children: (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                             <Select 
                                placeholder="Thêm thành viên..." 
                                style={{ width: 250 }} 
                                onChange={handleAddMember}
                                value={null}
                             >
                                {MOCK_RESIDENTS.map(r => (
                                    <Option key={r.id} value={r.id}>{r.full_name}</Option>
                                ))}
                             </Select>
                        </div>
                        <Table 
                            columns={memberColumns} 
                            dataSource={currentMembers} 
                            pagination={false} 
                            size="small" 
                            rowKey="id"
                            bordered 
                        />
                    </>
                )
            }
        ]} />
    );

    return (
        <MainCard title="Quản lý Hộ khẩu (Household Management)">
            {/* TOOLBAR */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={8}>
                    <Input 
                        placeholder="Tìm kiếm (Chủ hộ, CCCD, Phòng)..." 
                        prefix={<SearchOutlined />} 
                        onChange={e => setSearchText(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col span={6}>
                    <Select defaultValue="ALL" style={{ width: '100%' }} onChange={setStatusFilter}>
                        <Option value="ALL">Tất cả trạng thái</Option>
                        <Option value="1">Đang sinh sống</Option>
                        <Option value="0">Đã chuyển đi</Option>
                    </Select>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                    <Space>
                        <Button icon={<AuditOutlined />} onClick={() => setIsAbsenceModalOpen(true)}>
                            Khai báo Tạm trú/vắng
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                            Tạo Hộ khẩu
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* TABLE */}
            <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} rowKey="household_id" bordered />

            {/* MODAL MAIN */}
            <Modal
                title={editingRecord ? "Cập nhật Hộ khẩu" : "Tạo Hộ khẩu mới"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={800}
                destroyOnClose={true}
            >
                {modalContent}
            </Modal>

            {/* MODAL TẠM TRÚ/VẮNG */}
            <Modal
                title="Khai báo Tạm trú / Tạm vắng"
                open={isAbsenceModalOpen}
                onOk={() => { message.success("Đã lưu khai báo!"); setIsAbsenceModalOpen(false); }}
                onCancel={() => setIsAbsenceModalOpen(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={absenceForm} layout="vertical">
                    <Form.Item name="type" label="Loại khai báo" initialValue="tam_tru">
                        <Select><Option value="tam_tru">Tạm trú</Option><Option value="tam_vang">Tạm vắng</Option></Select>
                    </Form.Item>
                    <Form.Item name="person" label="Người khai báo (CCCD/Họ tên)" rules={[{ required: true }]}>
                        <Input placeholder="Nhập thông tin người khai báo" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}><Form.Item name="from" label="Từ ngày"><DatePicker style={{width:'100%'}}/></Form.Item></Col>
                        <Col span={12}><Form.Item name="to" label="Đến ngày"><DatePicker style={{width:'100%'}}/></Form.Item></Col>
                    </Row>
                    <Form.Item name="reason" label="Lý do"><Input.TextArea rows={3} /></Form.Item>
                </Form>
            </Modal>
        </MainCard>
    );
};

export default HouseholdManagement;