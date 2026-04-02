import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true,lowercase: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" },
    avatarId: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    phoneNumber: { type: String, default: "", sparse: true },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;