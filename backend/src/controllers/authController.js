import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../libs/token.js';
import Session from '../models/Session.js';
export const signUpController = async (req, res) => {
    try {
        const { userName, password, email, firstName, lastName } = req.body;
        if(!userName || !password || !email|| !firstName || !lastName) {
            return res.status(400).json({ message: "Username, password, email, firstName, and lastName are required." });
        }
        
        const duplicateUser = await User.findOne({ userName });
        if (duplicateUser) {
            return res.status(409).json({ message: "Username already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });


        await newUser.save();
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error during user sign-up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const signInController = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password." });
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({message:"Sign-in successful", user: user.displayName, accessToken  });
    } catch (error) {
        console.error("Error during user sign-in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const signOutController = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(204);
        }
        await Session.deleteOne({ refreshToken });
        res.clearCookie('refreshToken');
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error during user sign-out:", error);
        return res.status(500).json({ message: "Internal server error" });
    } 
}
