import { Form, Row, Col, Input, Select, Button, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from 'axios';

const { Option } = Select;

export default function PartnerSearch({ onSearch, onAddNew }) {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        mode: "onChange"
    });
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/resident/jobs');
                const jobNames = response.data.optional;
                if (jobNames && Array.isArray(jobNames)) {
                    setJobs(jobNames);
                } else {
                    console.error("Dữ liệu API công việc trả về không đúng định dạng: optional không phải mảng.");
                    setJobs([]);
                }

            } catch (error) {
                console.error("Lỗi khi tải danh sách công việc:", error);
                setJobs([]);
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
                    <Controller
                        name="fullName"
                        control={control}
                        rules={{
                            validate: value => {
                                if (!value) return true;
                                const nameRegex = /^[\p{L}\s]+$/u;
                                return nameRegex.test(value) || "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
                            }
                        }}
                        render={({ field }) => (
                            <Form.Item
                                label="Họ và tên"
                                validateStatus={errors.fullName ? "error" : ""}
                                help={errors.fullName?.message}
                            >
                                <Input {...field} placeholder="Nhập họ và tên" />
                            </Form.Item>
                        )}
                    />
                </Col>

                <Col span={8}>
                    <Controller
                        name="householdId"
                        control={control}
                        rules={{
                            validate: value => {
                                if (!value) return true; // cho phép để trống

                                const numberRegex = /^[0-9]+$/;

                                return (
                                    numberRegex.test(value) ||
                                    "Mã hộ gia đình chỉ được chứa số, không có khoảng trắng hoặc ký tự đặc biệt."
                                );
                            }
                        }}
                        render={({ field }) => (
                            <Form.Item
                                label="Mã hộ gia đình"
                                validateStatus={errors.householdId ? "error" : ""}
                                help={errors.householdId?.message}
                            >
                                <Input {...field} placeholder="Nhập mã hộ gia đình" />
                            </Form.Item>
                        )}
                    />
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
                                    <Option value="M">Nam</Option>
                                    <Option value="F">Nữ</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={18}>
                <Col span={8}>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{
                            validate: value => {
                                if (!value) return true; // không bắt buộc

                                const phoneRegex = /^[0-9]{10}$/;

                                return (
                                    phoneRegex.test(value) ||
                                    "Số điện thoại phải gồm đúng 10 số và không chứa ký tự khác."
                                );
                            }
                        }}
                        render={({ field }) => (
                            <Form.Item
                                label="Số điện thoại"
                                validateStatus={errors.phoneNumber ? "error" : ""}
                                help={errors.phoneNumber?.message}
                            >
                                <Input {...field} placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        )}
                    />
                </Col>


                <Col span={8}>
                    <Form.Item label={"Công việc"}>
                        <Controller
                            name="job"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Chọn công việc"
                                    allowClear
                                    loading={jobs.length === 0 && field.value === null}
                                >
                                    <Option value="">Tất cả</Option>
                                    {jobs.map(jobName => (
                                        <Option key={jobName} value={jobName}>
                                            {jobName}
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
