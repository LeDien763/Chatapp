import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { generateAccessToken, generateRefreshToken } from '../libs/token.js';
import crypto from "crypto";
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
// Đăng ký người dùng
export const signUp = async ({ userName, password, repassword, email, firstName, lastName }) => {
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
    // Kiểm tra email đã tồn tại
    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
        throw {
            status: 409,
            message: "Email already exists."
        };
    }
    // Kiểm tra mật khẩu xác nhận có khớp không
    if (password !== repassword) {
        throw {
            status: 400,
            message: "Password and confirmation password do not match."
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

    // Hash refresh token trước khi lưu DB (bảo mật)
    const hashedRefreshToken = hashToken(refreshToken);

    // Lưu session
    await Session.create({
        userId: user._id,
        refreshToken: hashedRefreshToken,
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
        throw {
            status: 400,
            message: "Refresh token is required."
        };
    }
    const hashedRefreshToken = hashToken(refreshToken);
    await Session.deleteOne({ refreshToken: hashedRefreshToken });
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
export const refreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw {
            status: 401,
            message: "Unauthorized"
        };
    }
    const hashedRefreshToken = hashToken(refreshToken);
    const session = await Session.findOne({ refreshToken: hashedRefreshToken });
    if (!session ) {
        throw { 
            status: 401,
            message: "Unauthorized"
        };
    }   
    if (session.expiresAt < new Date()) {
        await Session.deleteOne({ _id: session._id });
        throw {
            status: 401,
            message: "Refresh token expired"
        };
    }
    const userId = session.userId;
    const newAccessToken = generateAccessToken(userId);
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await session.save();
    return {
        accessToken: newAccessToken,
    };
}