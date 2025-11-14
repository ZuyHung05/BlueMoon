const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

// Load env vars (Luôn đặt lên đầu)
dotenv.config();

// ==========================================================
// Pre-load TẤT CẢ các models để đảm bảo populate() lồng nhau
// (User -> Role -> Permission) hoạt động ổn định.
// ==========================================================
require('./models/Permission'); 
require('./models/Role');       
require('./models/User');       
require('./models/IncidentType'); 
require('./models/Team');         
require('./models/Incident');     

const app = express();

// Kết nối DB (Sau khi load .env và models)
connectDB();

// Middleware
app.use(cors());      // Cho phép Frontend gọi
app.use(morgan('dev')); // Log request ra console
app.use(express.json()); // Đọc body dạng JSON
app.use(express.urlencoded({ extended: false }));


// Đây là API Lộc đang làm (đã sửa)
app.use('/api/auth', require('./routes/auth'));

// TODO (Lộc): sẽ thêm các API routes mới ở đây khi code
// app.use('/api/incidents', require('./routes/incidentRoutes'));
// app.use('/api/teams', require('./routes/teamRoutes'));


// Error Handler (Giữ nguyên của Lộc, rất tốt)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} (Connecting to DB...)`)
);