// frontend/src/views/admin/feeManager/FeeManagement.jsx

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import MainCard from 'ui-component/cards/MainCard';

const DefaultFeeManagement = () => {
    // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
    const [data, setData] = useState([
        {
            key: 1,
            id: 1,
            description: 'Phí quản lý chung cư (theo m2)',
            unit_price: 6000
        },
        {
            key: 2,
            id: 2,
            description: 'Phí gửi xe máy (theo tháng)',
            unit_price: 80000
        },
        {
            key: 3,
            id: 3,
            description: 'Phí gửi ô tô (theo tháng)',
            unit_price: 1200000
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // --- 2. XỬ LÝ FORM ---
    const showAddModal = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            description: record.description,
            unit_price: record.unit_price
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const { description, unit_price } = values;

            const newData = {
                description,
                unit_price
            };

            if (editingRecord) {
                // UPDATE
                const updatedData = data.map((item) =>
                    item.id === editingRecord.id
                        ? { ...item, unit_price: newData.unit_price } // Chỉ cập nhật unit_price, giữ nguyên description cũ để an toàn
                        : item
                );
                setData(updatedData);
                message.success('Cập nhật giá thành công!');
            } else {
                // CREATE
                const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
                setData([
                    ...data,
                    {
                        key: newId,
                        id: newId,
                        ...newData
                    }
                ]);
                message.success('Thêm loại phí mới thành công!');
            }

            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        message.success('Đã xóa loại phí');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // --- 3. CẤU HÌNH CỘT BẢNG ---
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center'
        },
        {
            title: 'Mô tả / Tên loại phí',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Đơn giá (VNĐ)',
            dataIndex: 'unit_price',
            key: 'unit_price',
            align: 'right',
            render: (price) => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{formatCurrency(price)}</span>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" ghost size="small">
                        Sửa
                    </Button>
                    <Popconfirm title="Xóa loại phí này?" onConfirm={() => handleDelete(record.id)} okText="Có" cancelText="Không">
                        <Button icon={<DeleteOutlined />} danger size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <MainCard title="Quản lý Định mức Phí (Default Fee)">
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: 16 }}>
                Thêm loại phí mới
            </Button>

            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} rowKey="id" bordered />

            <Modal
                title={editingRecord ? 'Sửa đơn giá phí' : 'Tạo loại phí mới'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    {/* Description */}
                    <Form.Item
                        name="description"
                        label="Mô tả / Tên loại phí"
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại phí!' }]}
                    >
                        {/* CHANGE HERE: Thêm thuộc tính disabled */}
                        <Input placeholder="Ví dụ: Phí gửi xe máy..." disabled={!!editingRecord} />
                    </Form.Item>

                    {/* Unit Price */}
                    <Form.Item
                        name="unit_price"
                        label="Đơn giá mặc định (VNĐ)"
                        rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="Nhập số tiền..."
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </MainCard>
    );
};

export default DefaultFeeManagement;
