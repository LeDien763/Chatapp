import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
export const sendFriendRequestService = async (requesterId, recipientId, message) => {
    if (requesterId === recipientId) {
        throw { status: 400, message: "You cannot send a friend request to yourself." };
    }
    
    const userExists = await User.exists({ _id: recipientId });
    if (!userExists) {
        throw { status: 404, message: "User not found." };
    }

    let userA = requesterId.toString();
    let userB = recipientId.toString();
    if (userA > userB) {
        [userA, userB] = [userB, userA];
    }
    const [existingFriendship, existingRequest] = await Promise.all([
        Friend.findOne({ UserA: userA, UserB: userB }),
        FriendRequest.exists({ 
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        })
    ]);
    if (existingFriendship) {
        throw { status: 400, message: "You are already friends." };
    }
    if (existingRequest) {
        throw { status: 400, message: "A friend request already exists between you and this user." };
    }
    const friendRequest = new FriendRequest({
        requester: requesterId,
        recipient: recipientId,
        message
    });
    await friendRequest.save();
    return friendRequest;
};
export const acceptFriendRequestService = async (requestId, recipientId) => {
    if (!requestId) {
        throw { status: 400, message: "Request ID is required." };
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
        throw { status: 404, message: "Friend request not found." };
    }

    if (friendRequest.recipient.toString() !== recipientId.toString()) {
        throw { status: 403, message: "You are not authorized to accept this friend request." };
    }

    const existingFriend = await Friend.findOne({
        $or: [
            { userA: friendRequest.requester, userB: friendRequest.recipient },
            { userA: friendRequest.recipient, userB: friendRequest.requester }
        ]
    });

    if (existingFriend) {
        throw { status: 400, message: "You are already friends." };
    }

    await Friend.create({
        userA: friendRequest.requester,
        userB: friendRequest.recipient
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const requester = await User.findById(friendRequest.requester)
        .select("_id displayName avatarUrl")
        .lean();

    return requester;
};
export const rejectFriendRequestService = async (requestId, recipientId) => {
    if (!requestId) {
        throw { status: 400, message: "Request ID is required." };
    }
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
        throw { status: 404, message: "Friend request not found." };
    }
    if (friendRequest.recipient.toString() !== recipientId.toString()) {
        throw { status: 403, message: "You are not authorized to reject this friend request." };
    }
    await FriendRequest.findByIdAndDelete(requestId);
    return friendRequest;
};
export const removeFriendService = async (userId, friendId) => {
    if (!userId) {
        throw { status: 400, message: "User ID is required." };
    }
    if (!friendId) {
        throw { status: 400, message: "Friend ID is required." };
    }
    const friend = await Friend.findOne({
        $and: [
            { userA: userId, userB: friendId },
            { userA: friendId, userB: userId }
        ]
    });
    if (!friend) {
        throw { status: 404, message: "Friend not found." };
    }
    await Friend.findByIdAndDelete(friend._id);
};
export const getFriendsListService = async (userId) => {
    if (!userId) {
        throw { status: 400, message: "User ID is required." };
    }
    return await Friend.find({
        $or: [
            { userA: userId },
            { userB: userId }
        ]
    })
    .populate({
        path: 'userA',
        select: '_id displayName avatarUrl'
    })
    .populate({
        path: 'userB',
        select: '_id displayName avatarUrl'
    });
};
export const getFriendRequestsService = async (userId) => {
    const [sentRequsests, receivedRequests] = await Promise.all([
        FriendRequest.find({ requester: userId }).populate('recipient', '_id displayName avatarUrl').lean(),
        FriendRequest.find({ recipient: userId }).populate('requester', '_id displayName avatarUrl').lean()
    ]);
    return {
        sentRequsests,
        receivedRequests
    };
}