import * as userService from '../services/userService.js';

export const authMe = async (req, res) => {
    try {
        // Lấy user từ middleware authentication
        const user = req.user;
        
        // Kiểm tra user tồn tại
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Format dữ liệu user
        const userData = userService.formatUserData(user);
        
        return res.status(200).json({ user: userData });
    } catch (error) {
        console.error("Error fetching user info:", error);
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message });
    }
}