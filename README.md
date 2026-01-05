# 🌙 BlueMoon - Hệ Thống Quản Lý Chung Cư

<div align="center">

![BlueMoon](https://img.shields.io/badge/BlueMoon-Residential%20Management-blue?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)

**Hệ thống quản lý toàn diện cho chung cư**



</div>

---



## 🎯 Giới thiệu

Đây là Project phục vụ cho môn Kỹ thuật phần mềm - IT4082 kỳ 2025.1

---

## Tính năng

### 👥 Quản lý Cư dân & Hộ gia đình
- Thêm, sửa, xóa thông tin cư dân
- Quản lý hộ gia đình và thành viên
- Lịch sử biến đổi nhân khẩu
- Đăng ký tạm trú/tạm vắng

### 🚗 Quản lý Phương tiện
- Đăng ký phương tiện (xe máy, ô tô, xe đạp)
- Bản đồ bãi đỗ xe tương tác
- Theo dõi vị trí đỗ xe

### 💰 Quản lý Phí & Thanh toán
- Quản lý các loại phí (dịch vụ, quản lý, đóng góp)
- Theo dõi trạng thái thanh toán
- Xuất báo cáo Excel/Phiếu thu

### 📊 Dashboard & Thống kê
- Dashboard phí dịch vụ (dành cho Accountant/Admin)
- Dashboard cư dân (dành cho Manager/Admin)
- Biểu đồ phân tích theo thời gian
- Thống kê tổng quan

### 🤖 AI Chatbot
- Truy vấn database bằng ngôn ngữ tự nhiên
- Hỗ trợ tiếng Việt
- Powered by PremSQL với model `prem-1B-SQL`

---

## 🛠️ Công nghệ sử dụng

- **Backend**: Spring Boot 3.5.6 (Java 17)
- **Frontend**: React 19.2.0 (Vite)
- **Database**: PostgreSQL
- **AI Chatbot**: FastAPI (Python) + PremSQL

---



## 📦 Cài đặt

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ZuyHung05/BlueMoon.git
cd BlueMoon
```

### 2️⃣ Cấu hình Database

Tạo database PostgreSQL:

```sql
CREATE DATABASE bluemoon;
```

Cập nhật thông tin database trong `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bluemoon
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3️⃣ Cài đặt Backend

```bash
# Build project với Maven
mvn clean install

# Hoặc skip tests
mvn clean install -DskipTests
```

### 4️⃣ Cài đặt Frontend

```bash
cd frontend

# Cài đặt dependencies
yarn install
# Hoặc: npm install
```

### 5️⃣ Cài đặt AI Chatbot (Tùy chọn)

```bash
cd premsql_bot

# Tạo môi trường ảo Python
py -3.11 -m venv venv

# Kích hoạt môi trường ảo
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt PyTorch với CUDA (nếu có GPU)
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu126

# Hoặc CPU only
pip3 install torch torchvision

# Cài đặt dependencies
pip install -r requirements.txt
```

Tạo file `.env` trong thư mục `premsql_bot`:

```env
# Database PostgreSQL
DB_URI=postgresql://username:password@localhost:5432/bluemoon

# Device cho PremSQL (cuda hoặc cpu)
PREMSQL_DEVICE=cuda
```

---

## 🎮 Hướng dẫn sử dụng

### Chạy Backend

```bash
# Từ thư mục gốc
mvn spring-boot:run

# Hoặc chạy file JAR
java -jar target/BlueMoon-0.0.1-SNAPSHOT.jar
```

Backend sẽ chạy tại: **http://localhost:8080**

### Chạy Frontend

```bash
cd frontend

npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000** 





---



<div align="center">

**Nếu project hữu ích, đừng quên cho chúng mình một Star!**

Made with ❤️ by Group 7 Huster

</div>

