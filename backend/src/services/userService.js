import User from '../models/User.js';

// Lấy thông tin user từ database theo ID
export const getUserById = async (userId) => {
    if (!userId) {
        throw {
            status: 400,
            message: "User ID is required."
        };
    }

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

// Format thông tin user (có thể dùng cho bất kì user object nào)
export const formatUserData = (user) => {
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
        displayName: user.displayName,
        avatarUrl: user.avatarUrl || null,
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || ""
    };
};