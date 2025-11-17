import React, { useState } from 'react';
import {
    Typography,
    Card,
    Layout,
    Table,
    Space,
    Button,
    Modal,
    Form,
    Input,
    Row,
    Col,
    DatePicker,
    Select,
    message,
} from 'antd';import PartnerSearch from './';
import { EyeOutlined, EditOutlined, DeleteOutlined, } from '@ant-design/icons';
import dayjs from 'dayjs'; // <-- THÊM: Cần thiết cho DatePicker
import customParseFormat from 'dayjs/plugin/customParseFormat'; // <-- THÊM

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;



export default function ResidentManagement() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (gender === 'male' ? 'Nam' : 'Nữ'),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Quan hệ với chủ hộ',
            dataIndex: 'family_role',
            key: 'family_role',
        },
        {
            title: 'Công việc',
            dataIndex: 'job',
            key: 'job',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => ( // 'record' là dữ liệu của cả hàng đó
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger // <-- Thêm 'danger' để nút có màu đỏ
                        onClick={() => handleDeleteConfirm(record)} // <-- Gọi hàm xác nhận
                    />
                    {/* 4. Thêm onClick để gọi hàm sửa */}
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleShowEditModal(record)}
                    />
                </Space>
            ),
        },
    ];


    const handleShowAddModal = () => {
        setEditingResident(null); // Đảm bảo đang là chế độ thêm mới
        form.resetFields();       // Xóa rác từ lần mở trước
        setIsFormModalOpen(true);
    };

    // 6. Hàm MỞ Modal cho chế độ CẬP NHẬT (từ nút Sửa trong bảng)
    const handleShowEditModal = (record) => {
        setEditingResident(record); // Đặt dữ liệu cư dân đang sửa

        // Xử lý dữ liệu trước khi đổ lên Form
        const formData = {
            ...record,
            // Convert chuỗi "DD/MM/YYYY" sang đối tượng dayjs
            date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth, 'DD/MM/YYYY') : null,
        };

        form.setFieldsValue(formData); // Đổ dữ liệu của 'record' vào form
        setIsFormModalOpen(true);
    };

    // 7. Hàm ĐÓNG Modal (cho cả 2 chế độ)
    const handleCancelModal = () => {
        setIsFormModalOpen(false);
        setEditingResident(null); // Luôn reset khi đóng
        form.resetFields();
    };

    const handleFormSubmit = (values) => {
        // Convert lại ngày sinh từ dayjs sang chuỗi string
        const processedValues = {
            ...values,
            date_of_birth: values.date_of_birth ? values.date_of_birth.format('DD/MM/YYYY') : null,
        };

        if (editingResident) {
            // --- Chế độ CẬP NHẬT ---
            console.log('Dữ liệu CẬP NHẬT (ID:', editingResident.resident_id, '):', processedValues);
            // Nơi bạn gọi API để CẬP NHẬT
            // Ví dụ: updateResidentApi(editingResident.resident_id, processedValues);
        } else {
            // --- Chế độ THÊM MỚI ---
            console.log('Dữ liệu THÊM MỚI:', processedValues);
            // Nơi bạn gọi API để TẠO MỚI
            // Ví dụ: createResidentApi(processedValues);
        }

        handleCancelModal(); // Đóng modal sau khi xử lý xong
        // Bạn có thể gọi lại API load danh sách ở đây
    };

    const handleDeleteConfirm = (record) => {
        Modal.confirm({
            title: 'Xác nhận xoá',
            content: (
                <>
                    Bạn có chắc muốn xoá cư dân "<b>{record.full_name}</b>"?
                    <br />
                    Hành động này không thể hoàn tác.
                </>
            ),
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            async onOk() {
                try {
                    // SỬA Ở ĐÂY: Dùng record.id thay vì record.resident_id
                    console.log('Đang gọi API để xoá resident_id (thực tế là id):', record.id);

                    // ... (Giả lập API) ...
                    await new Promise(resolve => setTimeout(resolve, 500));

                    message.success(`Đã xoá thành công "${record.full_name}".`);

                    // SỬA Ở ĐÂY: Lọc theo resident.id
                    setSearchResults(prevResults =>
                        prevResults.filter(resident => resident.id !== record.id)
                    );

                } catch (error) {
                    console.error('Lỗi khi xoá cư dân:', error);
                    message.error('Đã xảy ra lỗi khi xoá cư dân.');
                }
            },
        });
    };
    const handleSearch = (searchValues) => {
        console.log('Dữ liệu tìm kiếm nhận được từ con:', searchValues);
        setLoading(true);
        setTimeout(() => {
            const fakeApiResult = [
                { id: 1, full_name: 'Nguyễn Văn A', household_id: 'H001', gender: 'male', phone_number: '0987654321' },
                { id: 2, full_name: 'Trần Thị B', household_id: 'H002', gender: 'female', phone_number: '0901234567' },
            ];
            setSearchResults(fakeApiResult);
            setLoading(false);
        }, 1000);
    };

    return (
        <Content style={{ padding: '24px' }}>
            <Title level={2}>QUẢN LÝ CƯ DÂN</Title>

            <Card style={{ marginBottom: 24 }}>
                <PartnerSearch
                    onSearch={handleSearch}
                    onAddNew={handleShowAddModal}
                />
            </Card>


            <Card title="Danh sách cư dân">
                <Table
                    columns={columns}
                    dataSource={searchResults}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            {/* 7. Thêm Modal để thêm cư dân */}
            <Modal
                // 9. Title động
                title={editingResident ? 'Cập nhật cư dân' : 'Thêm cư dân mới'}
                open={isFormModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancelModal}
                width={800}
            >

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    {/* HÀNG 1: HỌ TÊN, NGÀY SINH */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true, /* ... */ }]}>
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="date_of_birth" label="Ngày sinh" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 2: GIỚI TÍNH, VAI TRÒ */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                                <Select placeholder="Chọn giới tính">
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="family_role" label="Vai trò trong gia đình" rules={[{ required: true }]}>
                                <Select placeholder="Chọn vai trò">
                                    <Option value="owner">Chủ hộ</Option>
                                    <Option value="spouse">Vợ/Chồng</Option>
                                    <Option value="child">Con</Option>
                                    <Option value="other">Thành viên khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 3: SĐT, CÔNG VIỆC */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phone_number" label="Số điện thoại" rules={[{ required: true, /* ... */ }]}>
                                <Input placeholder="Nhập 10 chữ số" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="job" label="Công việc">
                                <Input placeholder="Nhập công việc" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 4: MÃ HỘ GIA ĐÌNH, SỐ CMND/CCCD */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="household_id"
                                label="Mã hộ gia đình"
                                rules={[{ required: true, message: 'Vui lòng nhập mã hộ gia đình!' }]}
                            >
                                {/* 11. Bị vô hiệu hóa khi đang SỬA */}
                                <Input
                                    placeholder="Ví dụ: H001"
                                    disabled={!!editingResident} // <-- true khi sửa
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* Thêm trường id_number từ ảnh của bạn */}
                            <Form.Item
                                name="id_number"
                                label="Số CMND/CCCD"
                                rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD!' }]}
                            >
                                {/* 12. Bị vô hiệu hóa khi đang SỬA (thường là vậy) */}
                                <Input
                                    placeholder="Nhập số CMND/CCCD"
                                    disabled={!!editingResident} // <-- true khi sửa
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Content>
    );
}
