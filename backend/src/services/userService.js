import User from '../models/User.js';

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId) => {
    if (!userId) {
        throw {
            status: 400,
            message: "User ID is required."
        };
    }

    const user = await User.findById(userId).select('-hashedPassword');
    if (!user) {
        throw {
            status: 404,
            message: "User not found."
        };
    }

    return user;
};

// Lấy thông tin người dùng theo username
export const getUserByUsername = async (userName) => {
    if (!userName) {
        throw {
            status: 400,
            message: "Username is required."
        };
    }

    const user = await User.findOne({ userName }).select('-hashedPassword');
    if (!user) {
        throw {
            status: 404,
            message: "User not found."
        };
    }

    return user;
};

// Cập nhật thông tin hồ sơ người dùng
export const updateUserProfile = async (userId, { displayName, bio, phoneNumber, avatarUrl, avatarId }) => {
    if (!userId) {
        throw {
            status: 400,
            message: "User ID is required."
        };
    }

    // Kiểm tra người dùng tồn tại
    const user = await User.findById(userId);
    if (!user) {
        throw {
            status: 404,
            message: "User not found."
        };
    }

    // Cập nhật các trường được phép
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (avatarId) user.avatarId = avatarId;

    user.updatedAt = new Date();
    await user.save();

    return {
        message: "Profile updated successfully.",
        user: user.toObject({ getters: true })
    };
};

// Xóa tài khoản người dùng
export const deleteUserAccount = async (userId) => {
    if (!userId) {
        throw {
            status: 400,
            message: "User ID is required."
        };
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw {
            status: 404,
            message: "User not found."
        };
    }

    return {
        message: "User account deleted successfully."
    };
};

// Kiểm tra username đã tồn tại
export const checkUsernameExists = async (userName) => {
    if (!userName) {
        throw {
            status: 400,
            message: "Username is required."
        };
    }

    const user = await User.findOne({ userName });
    return {
        exists: !!user
    };
};

// Kiểm tra email đã tồn tại
export const checkEmailExists = async (email) => {
    if (!email) {
        throw {
            status: 400,
            message: "Email is required."
        };
    }

    const user = await User.findOne({ email });
    return {
        exists: !!user
    };
};

// Lấy danh sách người dùng (hỗ trợ phân trang)
export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const users = await User.find()
            .select('-hashedPassword')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        throw {
            status: 500,
            message: "Error fetching users."
        };
    }
};

// Cập nhật hình đại diện người dùng
export const updateUserAvatar = async (userId, { avatarUrl, avatarId }) => {
    if (!userId) {
        throw {
            status: 400,
            message: "User ID is required."
        };
    }

    if (!avatarUrl) {
        throw {
            status: 400,
            message: "Avatar URL is required."
        };
    }

    const user = await User.findById(userId);
    if (!user) {
        throw {
            status: 404,
            message: "User not found."
        };
    }

    user.avatarUrl = avatarUrl;
    if (avatarId) user.avatarId = avatarId;
    user.updatedAt = new Date();

    await user.save();

    return {
        message: "Avatar updated successfully.",
        user: user.toObject({ getters: true })
    };
};

// Tìm kiếm người dùng theo displayName
export const searchUsers = async (query) => {
    if (!query) {
        throw {
            status: 400,
            message: "Search query is required."
        };
    }

    const users = await User.find({
        $or: [
            { displayName: { $regex: query, $options: 'i' } },
            { userName: { $regex: query, $options: 'i' } }
        ]
    }).select('-hashedPassword').limit(20);

    return users;
};
