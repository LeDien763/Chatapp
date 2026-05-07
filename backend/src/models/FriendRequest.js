import mongoose from "mongoose";
const friendRequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String, trim: true, maxlength: 300 }
}, { timestamps: true });
friendRequestSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendRequestSchema.index({ recipient: 1});
friendRequestSchema.index({ requester: 1});
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;