const User = require('../models/User'); // Model User (đã sửa: fullName)
const Role = require('../models/Role'); // Model Role (đã sửa: enum, ref permissions)
const Permission = require('../models/Permission'); // Model Permission (mới)
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

/**
 * =========================================================================
 * FILE CONTROLLER 
 * =========================================================================
 *
 * Thay đổi trong hàm `register`:
 * 1. Nhận 'fullName' (thay vì 'username') từ req.body.
 * 2. Tìm Role theo enum mới ('citizen', 'authority', 'technician').
 * 3. Không hash password (vì Model User.js đã tự làm việc này).
 *
 * Thay đổi trong hàm `login`:
 * 1. Dùng "Nested Populate" để lấy User -> Role -> Permissions.
 * 2. Trả về "Hợp Đồng API" (JSON) mới cho Frontend (Mạnh):
 * - user.fullName
 * - user.role (tên role mới)
 * - user.permissions (mảng các object)
 */

// ========================== REGISTER ========================== //
exports.register = async (req, res) => {
  try {
    // THAY ĐỔI 1: Frontend phải gửi 'fullName', không phải 'username'
    const { fullName, email, password, role } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ fullName, email, password, và role.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng.'
      });
    }

    // THAY ĐỔI 2: Tìm role theo enum mới ('citizen', 'authority', 'technician')
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        message: `Role không hợp lệ. Phải là 'citizen', 'authority', hoặc 'technician'.`
      });
    }

    // THAY ĐỔI 3: Tạo user mới với model 'User' đã nâng cấp
    const user = new User({
      fullName: fullName, // Lưu vào trường 'fullName' mới
      email,
      password, // Cứ để password thô, Model User.js sẽ tự hash
      role: roleDoc._id
    });

    // Model sẽ tự hash password trước khi save (nhờ hook 'pre-save')
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Người dùng đã được đăng ký thành công.'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng ký người dùng.',
      error: err.message
    });
  }
};

// =========================== LOGIN =========================== //
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // THAY ĐỔI 4: Dùng Nested Populate để lấy thông tin chi tiết
    // Ta cần populate 2 cấp: User -> Role -> Permissions
    const user = await User.findOne({ email }).populate({
      path: 'role',        // 1. Populate trường 'role' trong User
      model: 'Role',       // Chỉ định model
      populate: {          // 2. Populate lồng: populate trường 'permissions' trong Role
        path: 'permissions',
        model: 'Permission' // Chỉ định model
      }
    });

    // Kiểm tra user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng với email này.'
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    // Tạo JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.name // Payload sẽ là: { id: "...", role: "citizen" }
      },
      process.env.JWT_SECRET || 'fallback_secret_nen_dat_trong_env', // Luôn dùng .env
      { expiresIn: '1h' }
    );

    // THAY ĐỔI 5: Trả về "HỢP ĐỒNG API" (JSON) MỚI CHO FRONTEND (MẠNH)
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,  // Sửa: user.user -> user.fullName
        email: user.email,
        role: user.role.name,     // Sửa: giá trị mới ('citizen', ...)
        permissions: user.role.permissions // Sửa: Giờ là [Object], không phải [String]
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng nhập.',
      error: err.message
    });
  }
};