import { Form, Row, Col, Input, Select, Button, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";

const { Option } = Select;

export default function PartnerSearch({ onSearch, onAddNew }) {
    const { register, handleSubmit, control } = useForm();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const fakeJobs = [
                    { id: 1, name: 'Kỹ sư' },
                    { id: 2, name: 'Bác sĩ' },
                    { id: 3, name: 'Giáo viên' },
                ];
                setJobs(fakeJobs);
            } catch (error) {
                console.error("Lỗi khi tải danh sách công việc:", error);
            }
        };

        fetchJobs();
    }, []);

    const searchData = (data) => {
        if (onSearch) {
            onSearch(data);
        } else {
            console.error("Prop 'onSearch' chưa được truyền vào PartnerSearch!");
        }
    };

    // 2. Sửa lại hàm này để gọi prop từ cha
    const handleAddNew = () => {
        if (onAddNew) {
            onAddNew(); // <-- Gọi hàm được truyền từ cha
        } else {
            console.error("Prop 'onAddNew' chưa được truyền vào PartnerSearch!");
        }
    };

    return (
        <Form onSubmitCapture={handleSubmit(searchData)} layout="vertical">
            <Row gutter={18}>
                <Col span={8}>
                    <Form.Item label="Họ và tên">
                        <Input placeholder="Nhập họ và tên" {...register("full_name")} />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="Mã hộ gia đình">
                        <Input placeholder="Nhập mã hộ gia đình" {...register("household_id")} />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="Giới tính">
                        <Controller
                            name="gender"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Tất cả"
                                    allowClear
                                >
                                    <Option value="">Tất cả</Option>
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={18}>
                <Col span={8}>
                    <Form.Item label={"Số điện thoại"}>
                        <Input placeholder="Nhập số điện thoại" {...register("phone_number")} />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label={"Công việc"}>
                        <Controller
                            name="job_id"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Chọn công việc"
                                    allowClear
                                >
                                    {jobs.map(job => (
                                        <Option key={job.id} value={job.id}>
                                            {job.name}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Space>
                <Button type="primary" htmlType="submit">
                    Tìm kiếm
                </Button>
                <Button type="primary" onClick={handleAddNew}>
                    Thêm
                </Button>
            </Space>
        </Form>
    );
}
