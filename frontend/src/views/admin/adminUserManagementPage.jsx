// frontend/src/views/admin/adminUserManagementPage.jsx

import React, { useState } from 'react';
import { 
    Table, Button, Modal, Form, Input, Select, 
    Popconfirm, message, Space, Tag, Row, Col 
} from 'antd';
import { 
    EditOutlined, DeleteOutlined, PlusOutlined, 
    SearchOutlined, UserAddOutlined 
} from '@ant-design/icons';
import MainCard from 'ui-component/cards/MainCard';

const { Option } = Select;

const AdminUserManagementPage = () => {
    // --- 1. MOCK DATA (Cập nhật Role mới) ---
    const [data, setData] = useState([
        {
            key: 1,
            account_id: 1,
            username: 'admin_sys',
            role: 'ADMIN',
            phone: '0901000001',
            last_login: '2025-10-20 08:30:00'
        },
        {
            key: 2,
            account_id: 2,
            username: 'ketoan_lan',
            role: 'ACCOUNTANT', // Kế toán
            phone: '0901000234',
            last_login: '2025-10-21 14:15:00'
        },
        {
            key: 3,
            account_id: 3,
            username: 'totruong_dung',
            role: 'LEADER', // Tổ trưởng
            phone: '0905000333',
            last_login: null
        }
    ]);

    // --- 2. STATE QUẢN LÝ UI ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const [form] = Form.useForm();

    // --- 3. FILTERING LOGIC ---
    const filteredData = data.filter(item => {
        const matchSearch = 
            item.username.toLowerCase().includes(searchText.toLowerCase()) || 
            item.phone.includes(searchText);
        const matchRole = roleFilter === 'ALL' || item.role === roleFilter;
        
        return matchSearch && matchRole;
    });

    // --- 4. HANDLERS (Thêm, Sửa, Xóa) ---
    
    const showAddModal = () => {
        setEditingRecord(null);
        form.resetFields();
        // Mặc định chọn role là Tổ trưởng khi tạo mới
        form.setFieldsValue({ role: 'LEADER' }); 
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            username: record.username,
            role: record.role,
            phone: record.phone,
            password: '' 
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (!editingRecord && !values.password) {
                message.error('Vui lòng nhập mật khẩu cho tài khoản mới!');
                return;
            }

            const newData = {
                username: values.username,
                role: values.role,
                phone: values.phone,
            };

            if (editingRecord) {
                // Update
                const updatedData = data.map((item) =>
                    item.account_id === editingRecord.account_id 
                    ? { ...item, ...newData } 
                    : item
                );
                setData(updatedData);
                message.success('Cập nhật tài khoản thành công!');
            } else {
                // Create
                const newId = data.length > 0 ? Math.max(...data.map(d => d.account_id)) + 1 : 1;
                setData([...data, { 
                    key: newId, 
                    account_id: newId, 
                    last_login: null, 
                    ...newData 
                }]);
                message.success('Tạo tài khoản mới thành công!');
            }
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        const newData = data.filter((item) => item.account_id !== id);
        setData(newData);
        message.success('Đã xóa tài khoản');
    };

    // Helper để map Role sang Tiếng Việt và Màu sắc
    const getRoleDisplay = (role) => {
        switch (role) {
            case 'ADMIN':
                return { label: 'Admin', color: 'red' };
            case 'ACCOUNTANT':
                return { label: 'Kế toán', color: 'green' };
            case 'LEADER':
                return { label: 'Tổ trưởng', color: 'blue' };
            default:
                return { label: role, color: 'default' };
        }
    };

    // --- 5. CẤU HÌNH CỘT BẢNG ---
    const columns = [
        {
            title: 'ID',
            dataIndex: 'account_id',
            width: 60,
            align: 'center',
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            render: (role) => {
                const { label, color } = getRoleDisplay(role);
                return (
                    <Tag color={color} key={role} style={{ minWidth: 80, textAlign: 'center' }}>
                        {label.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Đăng nhập lần cuối',
            dataIndex: 'last_login',
            key: 'last_login',
            render: (text) => text ? text : <span style={{color: '#ccc', fontStyle: 'italic'}}>Chưa đăng nhập</span>
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => showEditModal(record)} 
                        type="primary" 
                        ghost
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.account_id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <MainCard title="Quản lý Tài khoản (Admin / Kế toán / Tổ trưởng)">
            {/* --- TOOLBAR --- */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={8}>
                    <Input 
                        placeholder="Tìm theo Username hoặc SĐT..." 
                        prefix={<SearchOutlined />} 
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col span={6}>
                    <Select 
                        defaultValue="ALL" 
                        style={{ width: '100%' }} 
                        onChange={(value) => setRoleFilter(value)}
                    >
                        <Option value="ALL">Tất cả vai trò</Option>
                        <Option value="ADMIN">Admin</Option>
                        <Option value="LEADER">Tổ trưởng</Option>
                        <Option value="ACCOUNTANT">Kế toán</Option>
                    </Select>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                    <Button 
                        type="primary" 
                        icon={<UserAddOutlined />} 
                        onClick={showAddModal}
                    >
                        Tạo tài khoản
                    </Button>
                </Col>
            </Row>

            {/* --- TABLE --- */}
            <Table 
                columns={columns} 
                dataSource={filteredData} 
                pagination={{ pageSize: 5 }} 
                rowKey="account_id"
                bordered
            />

            {/* --- MODAL --- */}
            <Modal
                title={editingRecord ? "Sửa thông tin tài khoản" : "Tạo tài khoản mới"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingRecord ? "Cập nhật" : "Tạo mới"}
                cancelText="Hủy"
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical" name="userForm">
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input disabled={!!editingRecord} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={editingRecord ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu"}
                        rules={[{ required: !editingRecord, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Vai trò"
                                initialValue="LEADER"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            >
                                <Select>
                                    <Option value="ADMIN">Admin</Option>
                                    <Option value="LEADER">Tổ trưởng</Option>
                                    <Option value="ACCOUNTANT">Kế toán</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập SĐT!' },
                                    { pattern: /^[0-9]+$/, message: 'SĐT chỉ chứa số!' }
                                ]}
                            >
                                <Input maxLength={15} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </MainCard>
    );
};

export default AdminUserManagementPage;