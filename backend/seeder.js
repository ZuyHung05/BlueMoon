// Import các thư viện cần thiết
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Đường dẫn tới file db.js của Lộc

// Load .env
dotenv.config();

// Import TẤT CẢ các Models
// (Đảm bảo đường dẫn tới thư mục 'models' là chính xác)
const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const IncidentType = require('./models/IncidentType');
const Team = require('./models/Team');
const Incident = require('./models/Incident');

// Kết nối DB
connectDB();

// --- HÀM 1: IMPORT DỮ LIỆU ---
const importData = async () => {
  try {
    // Xóa sạch dữ liệu cũ (để tránh trùng lặp)
    await Permission.deleteMany();
    await Role.deleteMany();
    await IncidentType.deleteMany();
    
    // (Tạm thời không xóa User, Team, Incident để test)
    // await User.deleteMany();
    // await Team.deleteMany();
    // await Incident.deleteMany();

    console.log('Phase 1: Đã xóa dữ liệu cũ (Permissions, Roles, IncidentTypes)...');

    // --- 2. Tạo Permissions (Quyền Hạn) ---
    const perms = await Permission.insertMany([
      // Quyền của Người dân (Citizen)
      { code: 'CREATE_INCIDENT', description: 'Tạo báo cáo sự cố' },
      { code: 'VIEW_OWN_INCIDENTS', description: 'Xem sự cố của mình' },
      { code: 'RATE_INCIDENT', description: 'Đánh giá sự cố' },
      
      // Quyền của Cơ quan (Authority)
      { code: 'VIEW_ALL_INCIDENTS', description: 'Xem tất cả sự cố' },
      { code: 'ASSIGN_TASK', description: 'Phân công xử lý' },
      { code: 'UPDATE_TASK_STATUS', description: 'Cập nhật trạng thái xử lý' },
      
      // Quyền của Kỹ thuật (Technician)
      // (Technician dùng chung VIEW_ALL và UPDATE_TASK)
    ]);
    console.log('Phase 2: Đã tạo Permissions...');

    // Lấy ID của các quyền vừa tạo
    const createIncidentPerm = perms.find(p => p.code === 'CREATE_INCIDENT')._id;
    const viewOwnPerm = perms.find(p => p.code === 'VIEW_OWN_INCIDENTS')._id;
    const ratePerm = perms.find(p => p.code === 'RATE_INCIDENT')._id;
    const viewAllPerm = perms.find(p => p.code === 'VIEW_ALL_INCIDENTS')._id;
    const assignPerm = perms.find(p => p.code === 'ASSIGN_TASK')._id;
    const updatePerm = perms.find(p => p.code === 'UPDATE_TASK_STATUS')._id;

    // --- 3. Tạo Roles (Dùng enum và permissions mới) ---
    await Role.insertMany([
      { // Người dân
        name: 'citizen',
        permissions: [createIncidentPerm, viewOwnPerm, ratePerm]
      },
      { // Cơ quan chức năng
        name: 'authority',
        permissions: [viewAllPerm, assignPerm, updatePerm]
      },
      { // Kỹ thuật viên
        name: 'technician',
        permissions: [viewAllPerm, updatePerm]
      }
    ]);
    console.log('Phase 3: Đã tạo Roles (citizen, authority, technician)...');

    // --- 4. Tạo Incident Types (Danh mục Sự cố) ---
    await IncidentType.insertMany([
      { name: 'Ổ gà', description: 'Ổ gà, sụt lún mặt đường' },
      { name: 'Rác thải', description: 'Rác thải sai nơi quy định' },
      { name: 'Đèn đường hỏng', description: 'Đèn đường không sáng' },
      { name: 'Rò rỉ nước', description: 'Vỡ ống nước, rò rỉ nước sạch' },
      { name: 'Cây đổ', description: 'Cây xanh gãy đổ, chắn đường' }
    ]);
    console.log('Phase 4: Đã tạo IncidentTypes (Ổ gà, Rác thải...)...');

    console.log('-------------------------------');
    console.log('SUCCESS: Dữ liệu mồi đã được nạp thành công!');
    console.log('Bây giờ có thể chạy "node server.js"');
    process.exit();

  } catch (error) {
    console.error(`SEEDER ERROR: ${error.message}`);
    process.exit(1);
  }
};

// --- HÀM 2: HỦY DỮ LIỆU ---
const destroyData = async () => {
    try {
        await Permission.deleteMany();
        await Role.deleteMany();
        await IncidentType.deleteMany();
        await User.deleteMany();
        await Team.deleteMany();
        await Incident.deleteMany();
        
        console.log('SUCCESS: Đã hủy toàn bộ dữ liệu!');
        process.exit();
    } catch (error) {
        console.error(`DESTROY ERROR: ${error.message}`);
        process.exit(1);
    }
};

// --- LOGIC CHẠY TỪ TERMINAL ---
// process.argv[2] là đối số thứ 3 (ví dụ: 'node seeder.js -d')
if (process.argv[2] === '-d') {
  destroyData(); // Chạy hàm hủy
} else {
  importData(); // Chạy hàm nạp dữ liệu
}