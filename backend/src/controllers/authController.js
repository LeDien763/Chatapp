import * as authService from '../services/authService.js';

export const signUpController = async (req, res) => {
    try {
        const { userName, password, email, firstName, lastName } = req.body;
        await authService.signUp({ userName, password, email, firstName, lastName });
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error during user sign-up:", error);
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message });
    }
}
export const signInController = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const result = await authService.signIn({ userName, password });
        
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return res.status(200).json({
            message: result.message,
            user: result.user,
            accessToken: result.accessToken
        });
    } catch (error) {
        console.error("Error during user sign-in:", error);
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message });
    }
}
export const signOutController = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(204);
        }
        await authService.signOut(refreshToken);
        res.clearCookie('refreshToken');
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error during user sign-out:", error);
        return res.status(500).json({ message: "Internal server error" });
    } 
}