const mongoose = require('mongoose');

// File này SẼ ĐỌC biến 'MONGODB_URI' từ file .env

const connectDB = async () => {
  try {
    // 1. Đọc chuỗi kết nối TỪ file .env (đã load ở app.cjs)
    const mongoURI = process.env.MONGODB_URI;

    // 2. KIỂM TRA (Quan trọng):
    // Nếu lập trình viên quên tạo file .env, mongoURI sẽ là 'undefined'.
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // 3. Kết nối
    // Các options (useNewUrlParser, useUnifiedTopology) không còn cần thiết
    // trong Mongoose v6+ (thư viện hiện tại).
    await mongoose.connect(mongoURI);

    // 4. Log ra để Lộc biết đã kết nối đúng
    console.log(`✅ MongoDB Connected successfully to: ${mongoURI}`);

  } catch (err) {
    // Nếu .env thiếu, hoặc Mongoose không kết nối được (chưa bật local DB)
    // Server sẽ sập và báo lỗi rõ ràng.
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Thoát khỏi tiến trình với lỗi
  }
};

module.exports = connectDB;