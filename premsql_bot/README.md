# BlueMoon PremSQL Chatbot

Chatbot sử dụng PremSQL với model `prem-1B-SQL` để truy vấn database PostgreSQL bằng ngôn ngữ tự nhiên (tiếng Việt).


## Cài đặt

### 1. Tạo môi trường ảo 
```bash
cd premsql_bot
py -3.11 -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Cài đặt PyTorch với CUDA (nếu có GPU)

```bash
# CUDA 12.6
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu126

# Hoặc CPU only (chậm hơn)
pip3 install torch torchvision
```

### 3. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

**Lưu ý**: Lần đầu chạy, PremSQL sẽ tự động tải model `prem-1B-SQL` (~2GB) từ Hugging Face.

## Cấu hình

### 1. Tạo file `.env`

Sao chép từ `.env.example` (nếu có) hoặc tạo mới:

```bash
# Database PostgreSQL (Supabase)
DB_URI=postgresql://postgres.YOUR_PROJECT:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Device cho PremSQL
PREMSQL_DEVICE=cuda  # Hoặc 'cpu' nếu không có GPU
```

### 2. Điền thông tin database

- Thay `[YOUR_PASSWORD]` bằng password thực tế của PostgreSQL
- Nếu dùng database khác, thay đổi `DB_URI` cho phù hợp


## Run

```bash
uvicorn api:app --port 8001 
```
- Server sẽ chạy tại: `http://localhost:8001`



