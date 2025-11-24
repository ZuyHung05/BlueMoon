import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Checkbox,
    Popconfirm,
    message,
    Space,
    Tag,
    Upload,
    Tooltip,
    Tabs,
    Progress,
    Select,
    InputNumber,
    Descriptions,
    Radio
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
    FilePdfOutlined,
    UserOutlined,
    PrinterOutlined,
    ExportOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import MainCard from 'ui-component/cards/MainCard';
import dayjs from 'dayjs';

const PaymentPeriodManagement = () => {
    // --- DATA ĐỢT THU (MOCK) ---
    const [data, setData] = useState([
        {
            key: 1,
            payment_period_id: 1,
            description: 'Phí dịch vụ chung cư Tháng 10/2025',
            start_date: '2025-10-01',
            end_date: '2025-10-31',
            is_mandatory: true,
            count: 2,
            total: 8
        },
        {
            key: 2,
            payment_period_id: 2,
            description: 'Quyên góp quỹ từ thiện 2025',
            start_date: '2025-10-05',
            end_date: '2025-11-05',
            is_mandatory: false,
            count: 1,
            total: 8
        }
    ]);

    // --- MOCK DATA HỘ DÂN ---
    const mockAllHouseholds = [
        { id: 101, name: 'Hộ 101 - Nguyễn Văn A', room: '101', required_amount: 500000 },
        { id: 102, name: 'Hộ 102 - Lê Thị C', room: '102', required_amount: 500000 },
        { id: 201, name: 'Hộ 201 - Hoàng Văn D', room: '201', required_amount: 650000 },
        { id: 205, name: 'Hộ 205 - Trần Thị B', room: '205', required_amount: 650000 },
        { id: 301, name: 'Hộ 301 - Lê Văn C', room: '301', required_amount: 420000 },
        { id: 302, name: 'Hộ 302 - Ngô Thị E', room: '302', required_amount: 420000 },
        { id: 401, name: 'Hộ 401 - Đỗ Văn G', room: '401', required_amount: 550000 },
        { id: 402, name: 'Hộ 402 - Phạm Thị D', room: '402', required_amount: 550000 }
    ];

    // --- MOCK DATA ĐÃ ĐÓNG TIỀN ---
    const [paidResidents, setPaidResidents] = useState([
        {
            key: 'p1',
            payment_period_id: 1,
            household_id: 101,
            household_name: 'Hộ 101 - Nguyễn Văn A',
            room: '101',
            amount: 500000,
            date: '2025-10-05',
            method: 'Chuyển khoản'
        },
        {
            key: 'p2',
            payment_period_id: 1,
            household_id: 205,
            household_name: 'Hộ 205 - Trần Thị B',
            room: '205',
            amount: 650000,
            date: '2025-10-06',
            method: 'Tiền mặt'
        },
        {
            key: 'p3',
            payment_period_id: 2,
            household_id: 301,
            household_name: 'Hộ 301 - Lê Văn C',
            room: '301',
            amount: 200000,
            date: '2025-10-10',
            method: 'Chuyển khoản'
        } // Đóng góp 200k
    ]);

    // --- STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [payModalVisible, setPayModalVisible] = useState(false);
    const [viewPaymentDetail, setViewPaymentDetail] = useState(null);
    const [targetHousehold, setTargetHousehold] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    // State cho chức năng thêm đóng góp (Tự nguyện)
    const [addDonationVisible, setAddDonationVisible] = useState(false);
    const [donationForm] = Form.useForm();

    const [form] = Form.useForm();
    const [payForm] = Form.useForm();

    // --- HANDLERS ---
    const handleImportExcel = (info) => {
        if (info.file.status === 'done') message.success(`${info.file.name} imported thành công!`);
    };

    const handleExportBill = (record) => {
        message.loading(`Đang xuất danh sách đóng tiền đợt: ${record.description}...`);
        setTimeout(() => message.success('File Excel/PDF đã được tải xuống!'), 1000);
    };

    const showAddModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        setFilterStatus('all');
        setIsModalOpen(true);
    };

    const handleOpenPayModal = (householdRecord) => {
        setTargetHousehold(householdRecord);
        setPayModalVisible(true);
        payForm.resetFields();
    };

    const handleConfirmPayment = () => {
        payForm.validateFields().then((values) => {
            const newPayment = {
                key: Date.now(),
                payment_period_id: editingRecord.payment_period_id,
                household_id: targetHousehold.id,
                household_name: targetHousehold.name,
                room: targetHousehold.room,
                amount: targetHousehold.required_amount,
                date: dayjs().format('YYYY-MM-DD'),
                method: values.method
            };
            savePayment(newPayment);
            message.success(
                `Đã thu ${new Intl.NumberFormat('vi-VN').format(targetHousehold.required_amount)}đ của ${targetHousehold.name}`
            );
            setPayModalVisible(false);
            setTargetHousehold(null);
        });
    };

    const handleAddDonation = () => {
        donationForm.validateFields().then((values) => {
            const selectedHousehold = mockAllHouseholds.find((h) => h.id === values.household_id);
            const newPayment = {
                key: Date.now(),
                payment_period_id: editingRecord.payment_period_id,
                household_id: selectedHousehold.id,
                household_name: selectedHousehold.name,
                room: selectedHousehold.room,
                amount: values.amount,
                date: dayjs().format('YYYY-MM-DD'),
                method: values.method
            };
            savePayment(newPayment);
            message.success('Thêm đóng góp thành công!');
            setAddDonationVisible(false);
            donationForm.resetFields();
        });
    };

    const savePayment = (newPayment) => {
        setPaidResidents([newPayment, ...paidResidents]);
        const updatedMainData = data.map((item) =>
            item.payment_period_id === editingRecord.payment_period_id ? { ...item, count: item.count + 1 } : item
        );
        setData(updatedMainData);
        setEditingRecord((prev) => ({ ...prev, count: prev.count + 1 }));
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const { description, dateRange, is_mandatory } = values;
            const newData = {
                description,
                start_date: dateRange ? dateRange[0].format('YYYY-MM-DD') : '',
                end_date: dateRange ? dateRange[1].format('YYYY-MM-DD') : '',
                is_mandatory: !!is_mandatory
            };

            if (editingRecord) {
                const updatedData = data.map((item) =>
                    item.payment_period_id === editingRecord.payment_period_id ? { ...item, ...newData } : item
                );
                setData(updatedData);
                message.success('Cập nhật thành công!');
            } else {
                const newId = data.length + 1;
                setData([...data, { key: newId, payment_period_id: newId, count: 0, total: mockAllHouseholds.length, ...newData }]);
                message.success('Tạo mới thành công!');
            }
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        setData(data.filter((item) => item.payment_period_id !== id));
        message.success('Đã xóa đợt thu');
    };

    const getHouseholdStatusList = () => {
        if (!editingRecord) return [];

        const paidInThisPeriod = paidResidents.filter((p) => p.payment_period_id === editingRecord.payment_period_id);

        // TỰ NGUYỆN: Chỉ hiện danh sách đã đóng
        if (!editingRecord.is_mandatory) {
            return paidInThisPeriod.map((p) => ({
                ...p,
                id: p.household_id,
                name: p.household_name,
                required_amount: p.amount,
                status: 'Paid',
                paymentInfo: p
            }));
        }

        // BẮT BUỘC: Hiện danh sách toàn bộ
        const fullList = mockAllHouseholds.map((hh) => {
            const paymentInfo = paidInThisPeriod.find((p) => p.household_id === hh.id);
            return {
                ...hh,
                key: hh.id,
                status: paymentInfo ? 'Paid' : 'Unpaid',
                paymentInfo: paymentInfo
            };
        });

        if (filterStatus === 'paid') return fullList.filter((item) => item.status === 'Paid');
        if (filterStatus === 'unpaid') return fullList.filter((item) => item.status === 'Unpaid');
        return fullList;
    };

    // --- ĐIỀN FORM THU TIỀN (BẮT BUỘC) ---
    useEffect(() => {
        if (payModalVisible && targetHousehold) {
            payForm.setFieldsValue({
                household_name: targetHousehold.name,
                amount: targetHousehold.required_amount,
                method: 'Tiền mặt'
            });
        }
    }, [payModalVisible, targetHousehold, payForm]);

    // --- COLUMNS CHO TAB 2 ---
    const detailColumns = [
        { title: 'Phòng', dataIndex: 'room', width: 80, render: (t) => <Tag color="purple">{t}</Tag> },
        { title: 'Chủ hộ', dataIndex: 'name' },
        {
            title: editingRecord?.is_mandatory ? 'Số tiền quy định' : 'Số tiền đóng',
            dataIndex: 'required_amount',
            align: 'right',
            render: (val) => <b style={{ color: '#1890ff' }}>{new Intl.NumberFormat('vi-VN').format(val)} đ</b>
        },
        {
            title: 'Trạng thái',
            align: 'center',
            render: (_, record) => {
                if (record.status === 'Paid') {
                    return (
                        <Tooltip title="Xem chi tiết">
                            <Tag
                                color="success"
                                style={{ cursor: 'pointer', padding: '4px 10px' }}
                                onClick={() => setViewPaymentDetail(record.paymentInfo)}
                            >
                                <CheckCircleOutlined /> Đã đóng
                            </Tag>
                        </Tooltip>
                    );
                }
                return (
                    <Tooltip title="Nhấn để thu tiền">
                        <Tag color="error" style={{ cursor: 'pointer', padding: '4px 10px' }} onClick={() => handleOpenPayModal(record)}>
                            <CloseCircleOutlined /> Chưa đóng
                        </Tag>
                    </Tooltip>
                );
            }
        },
        {
            title: 'In',
            align: 'center',
            render: (_, record) => (
                <Button
                    icon={<PrinterOutlined />}
                    size="small"
                    disabled={record.status !== 'Paid'}
                    onClick={() => message.success(`Đang in phiếu cho ${record.name}`)}
                />
            )
        }
    ];

    const initialFormValues = editingRecord
        ? {
              description: editingRecord.description,
              dateRange: [dayjs(editingRecord.start_date), dayjs(editingRecord.end_date)],
              is_mandatory: editingRecord.is_mandatory
          }
        : { is_mandatory: true };

    // --- CẤU HÌNH CỘT BẢNG CHÍNH ---
    const columns = [
        { title: 'ID', dataIndex: 'payment_period_id', width: 50, align: 'center' },
        { title: 'Tên đợt thu', dataIndex: 'description', render: (text) => <b>{text}</b> },
        {
            title: 'Thời gian',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Tag color="blue">Start: {record.start_date}</Tag>
                    <Tag color="red">End: {record.end_date}</Tag>
                </Space>
            )
        },
        {
            title: 'Loại phí',
            dataIndex: 'is_mandatory',
            align: 'center',
            render: (val) => <Tag color={val ? 'geekblue' : 'orange'}>{val ? 'Bắt buộc' : 'Tự nguyện'}</Tag>
        },
        {
            // --- SỬA: CỘT TIẾN ĐỘ / TỔNG THU ---
            title: 'Tiến độ / Tổng thu',
            width: 200,
            align: 'center',
            render: (_, record) => {
                // Nếu là TỰ NGUYỆN: Hiển thị tổng tiền
                if (!record.is_mandatory) {
                    const totalDonation = paidResidents
                        .filter((p) => p.payment_period_id === record.payment_period_id)
                        .reduce((sum, item) => sum + item.amount, 0);

                    return (
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ color: '#389e0d', fontWeight: 'bold', fontSize: '14px' }}>
                                {new Intl.NumberFormat('vi-VN').format(totalDonation)} VNĐ
                            </span>
                            <div style={{ fontSize: '12px', color: 'gray' }}>({record.count} lượt đóng)</div>
                        </div>
                    );
                }

                // Nếu là BẮT BUỘC: Hiển thị Progress Bar
                return (
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                            {record.count} / {record.total} hộ
                        </span>
                        <Progress
                            percent={Math.round((record.count / record.total) * 100)}
                            size="small"
                            showInfo={false}
                            strokeColor={record.count === record.total ? '#52c41a' : '#1890ff'}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Import Excel">
                        <Upload showUploadList={false} onChange={handleImportExcel}>
                            <Button icon={<UploadOutlined />} size="small" />
                        </Upload>
                    </Tooltip>
                    <Tooltip title="Xuất danh sách">
                        <Button
                            icon={<ExportOutlined />}
                            onClick={() => handleExportBill(record)}
                            size="small"
                            style={{ color: 'green', borderColor: 'green' }}
                        />
                    </Tooltip>
                    <Tooltip title="Xem & Sửa">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" ghost size="small" />
                    </Tooltip>
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.payment_period_id)}>
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // --- MODAL CONTENT ---
    const modalContent = (
        <Tabs
            defaultActiveKey="1"
            items={[
                {
                    key: '1',
                    label: 'Thông tin chung',
                    children: (
                        <Form form={form} layout="vertical" style={{ marginTop: 10 }} initialValues={initialFormValues}>
                            <Form.Item name="description" label="Tên đợt thu" rules={[{ required: true }]}>
                                {' '}
                                <Input />{' '}
                            </Form.Item>
                            <Form.Item name="dateRange" label="Thời gian thu" rules={[{ required: true }]}>
                                {' '}
                                <DatePicker.RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />{' '}
                            </Form.Item>
                            <Form.Item name="is_mandatory" valuePropName="checked">
                                {' '}
                                <Checkbox>Khoản thu bắt buộc</Checkbox>{' '}
                            </Form.Item>
                        </Form>
                    )
                },
                ...(editingRecord
                    ? [
                          {
                              key: '2',
                              label: `Danh sách chi tiết (${editingRecord.count} hộ)`,
                              icon: <UserOutlined />,
                              children: (
                                  <>
                                      <div
                                          style={{
                                              marginBottom: 16,
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center'
                                          }}
                                      >
                                          {editingRecord.is_mandatory ? (
                                              <Radio.Group
                                                  value={filterStatus}
                                                  onChange={(e) => setFilterStatus(e.target.value)}
                                                  buttonStyle="solid"
                                              >
                                                  <Radio.Button value="all">Tất cả</Radio.Button>
                                                  <Radio.Button value="paid">Đã đóng</Radio.Button>
                                                  <Radio.Button value="unpaid">Chưa đóng</Radio.Button>
                                              </Radio.Group>
                                          ) : (
                                              <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDonationVisible(true)}>
                                                  Thêm người đóng
                                              </Button>
                                          )}
                                          <Button icon={<ExportOutlined />} onClick={() => handleExportBill(editingRecord)}>
                                              Xuất Excel
                                          </Button>
                                      </div>
                                      <Table
                                          columns={detailColumns}
                                          dataSource={getHouseholdStatusList()}
                                          pagination={{ pageSize: 5 }}
                                          size="small"
                                          bordered
                                      />
                                  </>
                              )
                          }
                      ]
                    : [])
            ]}
        />
    );

    return (
        <MainCard title="Quản lý Đợt thu phí">
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: 16 }}>
                Tạo đợt thu mới
            </Button>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} rowKey="payment_period_id" />

            {/* MAIN MODAL */}
            <Modal
                title={editingRecord ? 'Chi tiết Đợt thu' : 'Tạo đợt thu mới'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={950}
                destroyOnClose={true}
            >
                {modalContent}
            </Modal>

            {/* MODAL 2: XÁC NHẬN THU TIỀN (BẮT BUỘC) */}
            <Modal
                title="Xác nhận thu tiền"
                open={payModalVisible}
                onOk={handleConfirmPayment}
                onCancel={() => setPayModalVisible(false)}
                okText="Xác nhận Đã Thu"
                cancelText="Hủy"
                destroyOnClose={true}
                zIndex={1050}
            >
                <Form form={payForm} layout="vertical">
                    <Form.Item name="household_name" label="Tên chủ hộ">
                        {' '}
                        <Input disabled style={{ color: 'black' }} />{' '}
                    </Form.Item>
                    <Form.Item name="amount" label="Số tiền cần thu (Cố định)">
                        <InputNumber
                            style={{ width: '100%', fontWeight: 'bold', color: 'black' }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
                            disabled
                            addonAfter="VNĐ"
                        />
                    </Form.Item>
                    <Form.Item name="method" label="Hình thức" initialValue="Tiền mặt">
                        <Select>
                            <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                            <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL 3: THÊM ĐÓNG GÓP (TỰ NGUYỆN) */}
            <Modal
                title="Thêm đóng góp mới"
                open={addDonationVisible}
                onOk={handleAddDonation}
                onCancel={() => setAddDonationVisible(false)}
                okText="Thêm"
                cancelText="Hủy"
                destroyOnClose={true}
                zIndex={1050}
            >
                <Form form={donationForm} layout="vertical">
                    <Form.Item name="household_id" label="Chọn hộ đóng góp" rules={[{ required: true }]}>
                        <Select placeholder="Chọn hộ" showSearch optionFilterProp="children">
                            {mockAllHouseholds
                                .filter(
                                    (h) =>
                                        !paidResidents.some(
                                            (p) => p.household_id === h.id && p.payment_period_id === editingRecord?.payment_period_id
                                        )
                                )
                                .map((h) => (
                                    <Select.Option key={h.id} value={h.id}>
                                        {h.name} - {h.room}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="amount" label="Số tiền đóng góp" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
                            addonAfter="VNĐ"
                        />
                    </Form.Item>
                    <Form.Item name="method" label="Hình thức" initialValue="Tiền mặt">
                        <Select>
                            <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                            <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL 4: CHI TIẾT */}
            <Modal
                title="Chi tiết giao dịch"
                open={!!viewPaymentDetail}
                onCancel={() => setViewPaymentDetail(null)}
                footer={null}
                zIndex={1050}
            >
                {viewPaymentDetail && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Chủ hộ">{viewPaymentDetail.household_name}</Descriptions.Item>
                        <Descriptions.Item label="Số tiền">
                            <b style={{ color: 'green' }}>{new Intl.NumberFormat('vi-VN').format(viewPaymentDetail.amount)} VNĐ</b>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày">{viewPaymentDetail.date}</Descriptions.Item>
                        <Descriptions.Item label="Hình thức">{viewPaymentDetail.method}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </MainCard>
    );
};

export default PaymentPeriodManagement;
