import mongoose from "mongoose";
const friendSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String, trim: true, maxlength: 300 }
}, { timestamps: true });
friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendSchema.index({ recipient: 1});
friendSchema.index({ requester: 1});
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;