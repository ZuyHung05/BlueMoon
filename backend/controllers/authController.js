const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ========================== REGISTER ========================== //
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Find role by name (admin, user, engineer)
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      user: username,   // because your schema uses "user", not "username"
      email,
      password,
      role: roleDoc._id
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error registering new user',
      error: err.message
    });
  }
};
// =========================== LOGIN =========================== //
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate role document
    const user = await User.findOne({ email }).populate('role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.name        // "admin", "engineer", "user"
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // Respond
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user: user.user,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: err.message
    });
  }
};
