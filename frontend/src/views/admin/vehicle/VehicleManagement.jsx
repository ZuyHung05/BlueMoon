// frontend/src/views/admin/vehicle/VehicleManagement.jsx

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Space, Tag, InputNumber, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import MainCard from 'ui-component/cards/MainCard';

const { Option } = Select;

const VehicleManagement = () => {
    const mockHouseholds = [
        { id: 101, name: 'Hộ 101 - Nguyễn Văn A', cccd: '00109xxx' },
        { id: 102, name: 'Hộ 102 - Trần Thị B', cccd: '00108xxx' },
        { id: 205, name: 'Hộ 205 - Lê Văn C', cccd: '00107xxx' }
    ];

    const [data, setData] = useState([
        {
            key: 1,
            vehicle_id: 1,
            household_id: 101,
            plate_number: '29A-123.45',
            type: 'car',
            basement_floor: 1,
            location: 'A-10'
        },
        {
            key: 2,
            vehicle_id: 2,
            household_id: 101,
            plate_number: '29B1-999.99',
            type: 'bike',
            basement_floor: 1,
            location: 'B-05'
        },
        {
            key: 3,
            vehicle_id: 3,
            household_id: 102,
            plate_number: '30E-555.66',
            type: 'car',
            basement_floor: 2,
            location: 'C-22'
        }
    ]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // Lọc theo Biển số hoặc Tên chủ hộ
    const filteredData = data.filter((item) => {
        const household = mockHouseholds.find((h) => h.id === item.household_id);
        const ownerName = household ? household.name.toLowerCase() : '';
        const plate = item.plate_number.toLowerCase();
        const search = searchText.toLowerCase();

        return plate.includes(search) || ownerName.includes(search);
    });

    // --- CRUD ---
    const showAddModal = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            household_id: record.household_id,
            plate_number: record.plate_number,
            type: record.type,
            basement_floor: record.basement_floor,
            location: record.location
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const newData = { ...values };

            if (editingRecord) {
                // SỬA
                const updatedData = data.map((item) => (item.vehicle_id === editingRecord.vehicle_id ? { ...item, ...newData } : item));
                setData(updatedData);
                message.success('Cập nhật thông tin xe thành công!');
            } else {
                // THÊM
                const newId = data.length > 0 ? Math.max(...data.map((d) => d.vehicle_id)) + 1 : 1;
                setData([
                    ...data,
                    {
                        key: newId,
                        vehicle_id: newId,
                        ...newData
                    }
                ]);
                message.success('Thêm phương tiện mới thành công!');
            }
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        const newData = data.filter((item) => item.vehicle_id !== id);
        setData(newData);
        message.success('Đã xóa phương tiện');
    };

    // --- CẤU HÌNH CỘT BẢNG ---
    const columns = [
        {
            title: 'ID',
            dataIndex: 'vehicle_id',
            width: 50,
            align: 'center'
        },
        {
            title: 'Chủ hộ (Household)',
            dataIndex: 'household_id',
            key: 'household_id',
            render: (id) => {
                const hh = mockHouseholds.find((h) => h.id === id);
                return hh ? <b>{hh.name}</b> : <span style={{ color: 'red' }}>Chưa rõ</span>;
            }
        },
        {
            title: 'Biển số xe',
            dataIndex: 'plate_number',
            key: 'plate_number',
            render: (text) => (
                <Tag color="blue" style={{ fontSize: '14px' }}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Loại xe',
            dataIndex: 'type',
            key: 'type',
            render: (type) => <Tag color={type === 'car' ? 'purple' : 'green'}>{type === 'car' ? 'Ô tô' : 'Xe máy'}</Tag>
        },
        {
            title: 'Vị trí đỗ',
            key: 'location',
            render: (_, record) => (
                <span>
                    Tầng hầm <b>{record.basement_floor}</b> - Ô <b>{record.location}</b>
                </span>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" ghost size="small">
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa xe này?"
                        onConfirm={() => handleDelete(record.vehicle_id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <MainCard title="Quản lý Phương tiện (Vehicle Management)">
            {/* Thanh công cụ: Tìm kiếm + Thêm mới + Sơ đồ */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Input
                        placeholder="Tìm theo biển số hoặc tên chủ hộ..."
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Space>
                        {/* Nút Sơ đồ*/}
                        <Button icon={<EnvironmentOutlined />}>Sơ đồ bãi đỗ</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                            Thêm phương tiện
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} rowKey="vehicle_id" bordered />

            {/* Modal Form */}
            <Modal
                title={editingRecord ? 'Sửa thông tin phương tiện' : 'Thêm phương tiện mới'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    {/* Chọn hộ gia đình */}
                    <Form.Item
                        name="household_id"
                        label="Thuộc hộ gia đình"
                        rules={[{ required: true, message: 'Vui lòng chọn hộ sở hữu!' }]}
                    >
                        <Select placeholder="Chọn hộ gia đình" showSearch optionFilterProp="children">
                            {mockHouseholds.map((h) => (
                                <Option key={h.id} value={h.id}>
                                    {h.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            {/* Biển số xe */}
                            <Form.Item
                                name="plate_number"
                                label="Biển số xe"
                                rules={[{ required: true, message: 'Vui lòng nhập biển số!' }]}
                            >
                                <Input placeholder="VD: 29A-123.45" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* Loại xe: Constraint check(car, bike)  */}
                            <Form.Item name="type" label="Loại xe" rules={[{ required: true, message: 'Vui lòng chọn loại xe!' }]}>
                                <Select placeholder="Chọn loại">
                                    <Option value="bike">Xe máy</Option>
                                    <Option value="car">Ô tô</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            {/* Tầng hầm */}
                            <Form.Item name="basement_floor" label="Tầng hầm" rules={[{ required: true, message: 'Nhập tầng hầm!' }]}>
                                <InputNumber min={1} max={3} style={{ width: '100%' }} placeholder="VD: 1" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* Vị trí ô đỗ */}
                            <Form.Item name="location" label="Vị trí / Ô đỗ" rules={[{ required: true, message: 'Nhập vị trí đỗ!' }]}>
                                <Input placeholder="VD: A-10" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </MainCard>
    );
};

export default VehicleManagement;
