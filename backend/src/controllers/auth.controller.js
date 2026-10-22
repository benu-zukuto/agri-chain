const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.register = async (req, res, next) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone, role });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json(new ApiResponse(201, { user: { id: user._id, name, role }, token }, "Registered successfully"));
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new ApiError(401, 'Invalid credentials'));
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json(new ApiResponse(200, { user: { id: user._id, name: user.name, role: user.role }, token }, "Logged in successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};
