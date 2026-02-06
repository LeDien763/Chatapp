import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { generateAccessToken, generateRefreshToken } from '../libs/token.js';

// Đăng ký người dùng
export const signUp = async ({ userName, password, email, firstName, lastName }) => {
    // Kiểm tra dữ liệu đầu vào
    if (!userName || !password || !email || !firstName || !lastName) {
        throw {
            status: 400,
            message: "Username, password, email, firstName, and lastName are required."
        };
    }

    // Kiểm tra username đã tồn tại
    const duplicateUser = await User.findOne({ userName });
    if (duplicateUser) {
        throw {
            status: 409,
            message: "Username already exists."
        };
    }

    // Mã hóa password và tạo user mới
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        hashedPassword,
        email,
        displayName: `${firstName} ${lastName}`,
    });

    await newUser.save();
    return { message: "Sign-up successful" };
};

// Đăng nhập
export const signIn = async ({ userName, password }) => {
    // Kiểm tra dữ liệu đầu vào
    if (!userName || !password) {
        throw {
            status: 400,
            message: "Username and password are required."
        };
    }

    // Tìm user
    const user = await User.findOne({ userName });
    if (!user) {
        throw {
            status: 401,
            message: "Invalid username or password."
        };
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
        throw {
            status: 401,
            message: "Invalid username or password."
        };
    }

    // Tạo tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Lưu session
    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        message: "Sign-in successful",
        user: user.displayName,
        accessToken,
        refreshToken
    };
};

// Đăng xuất
export const signOut = async (refreshToken) => {
    if (!refreshToken) {
        return { message: "Sign-out successful" };
    }

    await Session.deleteOne({ refreshToken });
    return { message: "Sign-out successful" };
};

// Lấy thông tin người dùng (authMe)
export const authMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw {
            status: 404,
            message: "User not found."
        };
    }

    return {
        id: user._id,
        userName: user.userName,
        email: user.email,
        displayName: user.displayName
    };
};
