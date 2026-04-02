import mongoose from "mongoose";
const friendSchema = new mongoose.Schema({
    UserA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    UserB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
friendSchema.pre('save', async function (next) {
    if (this.UserA.toString() > this.UserB.toString()) {
        [this.UserA, this.UserB] = [this.UserB, this.UserA];
    }
    next();
});
friendSchema.index({ UserA: 1, UserB: 1 }, { unique: true });
const Friend = mongoose.model("Friend", friendSchema);
export default Friend;