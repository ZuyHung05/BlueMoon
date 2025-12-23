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
} from 'antd';
// Giả định PartnerSearch là component con để tìm kiếm
import PartnerSearch from './';
import { EyeOutlined, EditOutlined, DeleteOutlined, } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from 'axios';
dayjs.extend(customParseFormat);

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;



export default function ResidentManagement() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    // editingResident sẽ chứa toàn bộ dữ liệu của cư dân đang sửa (bao gồm cả id)
    const [editingResident, setEditingResident] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            // Xử lý giá trị M/F từ BE sang Nam/Nữ
            render: (gender) => (gender === 'M' ? 'Nam' : 'Nữ'),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            // Dữ liệu trong state đã là đối tượng dayjs, giờ format lại
            render: (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '-'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Quan hệ với chủ hộ',
            dataIndex: 'familyRole',
            key: 'familyRole',
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
                        danger
                        onClick={() => handleDeleteConfirm(record)}
                    />
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
        form.resetFields();
        setIsFormModalOpen(true);
    };

    // 🔴 ĐÃ SỬA: Đổ dữ liệu từ record lên Form (record.dateOfBirth đã là Dayjs object)
    const handleShowEditModal = (record) => {
        setEditingResident(record); // Đặt dữ liệu cư dân đang sửa

        // record đã chứa dateOfBirth là Dayjs object (từ hàm handleSearch)
        // và các key khác (fullName, gender,...) đã khớp với Form.Item name
        form.setFieldsValue(record);
        setIsFormModalOpen(true);
    };

    const handleCancelModal = () => {
        setIsFormModalOpen(false);
        setEditingResident(null);
        form.resetFields();
    };

    // 🚀 ĐÃ SỬA: Thêm logic CẬP NHẬT
    const handleFormSubmit = async (values) => {
        // 1. Tiền xử lý dữ liệu trước khi gửi lên BE
        // Lấy tất cả các trường từ form (values)
        const processedValues = {
            ...values,
            // Chuyển đổi đối tượng Dayjs sang chuỗi YYYY-MM-DD để gửi lên BE
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
            // Đảm bảo householdId và idNumber được gửi lên một cách tường minh
            householdId: values.householdId,
            idNumber: values.idNumber,
        };

        if (editingResident) {
            // --- Xử lý CẬP NHẬT (UPDATE) ---
            const residentId = editingResident.id; // Lấy ID đã được map (là residentId)

            // ⚠️ Kiểm tra tính hợp lệ của ID trước khi gọi API
            if (!residentId) {
                message.error('Lỗi: Không tìm thấy ID cư dân để cập nhật.');
                return;
            }

            try {
                const response = await axios.post(
                    // URL hợp lệ: /resident/update/{residentId}
                    `http://localhost:8080/resident/update/${residentId}`,
                    processedValues // Dữ liệu form đã được xử lý
                );

                const { code, message: msg } = response.data;

                if (code === 1000) {
                    message.success(msg || 'Cập nhật cư dân thành công!');

                    // Cập nhật lại danh sách trong UI
                    const updatedRecord = {
                        ...editingResident,
                        // Sử dụng tất cả các giá trị mới từ form (bao gồm cả Dayjs object cho dateOfBirth)
                        ...values,
                    };

                    setSearchResults(prevResults =>
                        prevResults.map(resident =>
                            resident.id === residentId ? updatedRecord : resident
                        )
                    );

                    handleCancelModal();
                } else {
                    message.error(msg || 'Đã xảy ra lỗi nghiệp vụ từ máy chủ khi cập nhật.');
                }
            } catch (error) {
                console.error("Lỗi khi gọi API cập nhật cư dân:", error);

                if (error.response && error.response.data) {
                    // Xử lý lỗi từ phản hồi BE (nếu không phải lỗi CORS)
                    const { message: msg } = error.response.data;
                    message.error(`Cập nhật thất bại: ${msg || 'Lỗi không xác định.'}`);
                } else {
                    // Xử lý lỗi mạng (bao gồm lỗi CORS sau khi thất bại POST)
                    message.error('Đã xảy ra lỗi kết nối mạng. Vui lòng thử lại.');
                }
            }

            return;
        }

        // --- Xử lý THÊM MỚI (ADD) ---
        try {
            const response = await axios.post(
                'http://localhost:8080/resident/add',
                processedValues
            );

            const { code, message: msg } = response.data;

            if (code === 1000) {
                // Thành công
                message.success(msg || 'Thêm cư dân mới thành công!');
                handleCancelModal();
                // Lý tưởng: Gọi lại hàm handleSearch để làm mới danh sách
            } else {
                message.error(msg || 'Đã xảy ra lỗi nghiệp vụ từ máy chủ.');
            }

        } catch (error) {
            console.error("Lỗi khi gọi API thêm cư dân:", error);

            if (error.response && error.response.data) {
                const { code, message: msg } = error.response.data;
                let errorMessage = msg;
                let fieldToSetError = null;

                if (code === 9999 || code === 1001) {

                    const regex = /\"(.*?)\"/;
                    const match = msg.match(regex);

                    if (match && match[1]) {
                        errorMessage = match[1];
                    } else if (msg) {
                        errorMessage = msg;
                    }

                    if (errorMessage.includes("Mã hộ gia đình") || errorMessage.includes("NOT_FOUND")) {
                        fieldToSetError = 'householdId';
                    } else if (errorMessage.includes("Số điện thoại")) {
                        fieldToSetError = 'phoneNumber';
                    }

                    if (fieldToSetError) {
                        form.setFields([
                            {
                                name: fieldToSetError,
                                errors: [errorMessage],
                            },
                        ]);
                        message.warning(`Vui lòng kiểm tra lại trường ${fieldToSetError}.`);
                        return;
                    }

                    message.error(`Thêm cư dân thất bại: ${errorMessage}`);

                } else {
                    message.error(`Lỗi máy chủ: ${error.response.status}. Vui lòng thử lại.`);
                }
            } else {
                message.error('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra mạng.');
            }
        }
    };



    const handleDeleteConfirm = (record) => {
        Modal.confirm({
            title: 'Xác nhận xoá',
            content: (
                <>
                    Bạn có chắc muốn xoá cư dân "<b>{record.fullName}</b>"?
                    <br />
                    Hành động này không thể hoàn tác.
                </>
            ),
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            async onOk() {
                try {
                    // Giả lập API xoá
                    console.log('Đang gọi API để xoá resident ID:', record.id);
                    // Ở đây bạn sẽ thay bằng gọi axios.delete:
                    // await axios.delete(`http://localhost:8080/resident/delete/${record.id}`);

                    // Giả lập thành công
                    await new Promise(resolve => setTimeout(resolve, 500));

                    message.success(`Đã xoá thành công "${record.fullName}".`);

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

    // ✅ LƯU Ý: Đã sửa logic mapping trong handleSearch để đảm bảo dateOfBirth là Dayjs object
    const handleSearch = async (searchValues) => {
        console.log('Dữ liệu tìm kiếm nhận được từ con:', searchValues);
        setLoading(true);

        const payload = {
            fullName: searchValues.fullName,
            householdId: searchValues.householdId,
            gender: searchValues.gender,
            phoneNumber: searchValues.phoneNumber,
            job: searchValues.job,
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/resident/search',
                payload
            );

            if (response.data && response.data.result) {

                const mappedResults = response.data.result.map((item, index) => ({
                    // 🔴 ĐÃ SỬA: Dùng 'residentId' làm khóa chính 'id' cho Ant Design Table (rowKey="id")
                    // Nếu residentId là null/undefined, dùng index làm key dự phòng để tránh lỗi React key
                    id: item.residentId || index,
                    ...item,
                    // CHUYỂN ĐỔI CHUỖI YYYY-MM-DD TỪ BE SANG ĐỐI TƯỢNG DAYJS
                    dateOfBirth: item.dateOfBirth ? dayjs(item.dateOfBirth, 'YYYY-MM-DD') : null,
                }));

                setSearchResults(mappedResults);
                message.success(`Tìm kiếm thành công, tìm thấy ${mappedResults.length} cư dân.`);
            } else {
                setSearchResults([]);
                message.info('Không tìm thấy cư dân nào khớp với điều kiện.');
            }

        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm cư dân:", error);
            message.error("Đã xảy ra lỗi khi tìm kiếm cư dân.");
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
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
                    rowKey="id" // Dùng 'id' làm key cho hàng
                />
            </Card>

            {/* Modal Form */}
            <Modal
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
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ và tên.' },
                                    {
                                        pattern: /^[a-zA-Z\s\u00C0-\u1EF9'-]+$/,
                                        message: 'Họ và tên không được chứa số hoặc ký tự đặc biệt.'
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="dateOfBirth"
                                label="Ngày sinh"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh.' }]}
                            >
                                {/* Format ngày phải là YYYY-MM-DD để gửi lên BE */}
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính.' }]}
                            >
                                <Select placeholder="Chọn giới tính">
                                    <Option value="M">Nam</Option>
                                    <Option value="F">Nữ</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="familyRole"
                                label="Vai trò trong gia đình"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò.' }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    <Option value="Chủ hộ">Chủ hộ</Option> {/* Thêm Chủ hộ */}
                                    <Option value="Chồng">Chồng</Option>
                                    <Option value="Vợ">Vợ</Option>
                                    <Option value="Con trai">Con trai</Option>
                                    <Option value="Con gái">Con gái</Option>
                                    <Option value="Khác">Khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 3: SĐT, CÔNG VIỆC */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại.' },
                                    {
                                        pattern: /^[0-9]{10}$/,
                                        message: "Số điện thoại phải gồm đúng 10 số."
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập 10 chữ số" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="job"
                                label="Công việc"
                                rules={[
                                    {
                                        pattern: /^[\p{L}\s'-]+$/u,
                                        message: 'Công việc không được chứa số hay ký tự đặc biệt.'
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập công việc" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* HÀNG 4: MÃ HỘ GIA ĐÌNH, SỐ CMND/CCCD */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="householdId"
                                label="Mã hộ gia đình"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã hộ gia đình!' },
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Mã hộ gia đình chỉ được chứa số.'
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="Ví dụ: 12345"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="idNumber"
                                label="Số CMND/CCCD"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số CMND/CCCD!' },
                                    {
                                        pattern: /^[0-9]{9}$|^[0-9]{12}$/,
                                        message: 'Số CMND phải là 9 số, hoặc CCCD phải là 12 số.'
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="Ví dụ: 001200000001 (12 số) hoặc 123456789 (9 số)"

                                /> {/* Disable khi UPDATE */}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Content>
    );
}
