import mongoose from "mongoose";
const pasticipantSchema = new mongoose.Schema({
    userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', 
                 required: true 
            },
    joinedAt: { 
                type: Date, 
                default: Date.now 
            },
});
const groupSchema = new mongoose.Schema({
    name: { type: String, 
        required: true, 
        trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    avatarUrl: { type: String, default: "" },
    avatarId: { type: String, default: "" },
}
, { _id: false });
const lastMessageSchema = new mongoose.Schema({
    _id: { type: String },
    content: { type: String, trim: true, default: null },
    imgUrl: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: null }
}, { _id: false });
const conversationSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['direct', 'group'], 
        required: true },
    participants:{
        type: [pasticipantSchema],
        required: true
    },
    group: { 
        type: [groupSchema]
        },
    lastMessageAt: {
        type: Date,
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: lastMessageSchema,
        default: null
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });
conversationSchema.index({ "participants.userId": 1, lastMessageAt: -1 });
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
    

