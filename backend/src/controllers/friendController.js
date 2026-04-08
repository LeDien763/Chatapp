import { sendFriendRequestService, 
    acceptFriendRequestService, 
    rejectFriendRequestService, 
    getFriendRequestsService, 
    getFriendsListService } from "../services/friendService";
export const sendFriendRequestController = async (req, res) => {
    const requesterId = req.user._id;
    const { recipientId, message } = req.body;

    try {
        await sendFriendRequestService(requesterId, recipientId, message);
        return res.status(201).json({ message: "Friend request sent successfully." });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
export const acceptFriendRequestController = async (req, res) => {
    const recipientId = req.user.id;
    const { requestId } = req.params;

    try {        
        const requester = await acceptFriendRequestService(requestId, recipientId);

        return res.status(200).json({ 
            message: "Friend request accepted.",
            newFriend: {
                _id: requester._id,
                userName: requester.userName,
                displayName: requester.displayName,
                avatarUrl: requester.avatarUrl 
            } 
        });

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
export const rejectFriendRequestController = async (req, res) => {
    const recipientId = req.user.id;
    const { requestId } = req.params;
    try {
        await rejectFriendRequestService(requestId, recipientId);
        return res.status(200).json({ message: "Friend request rejected." });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
export const getFriendRequestsController = async (req, res) => {
    const userId = req.user.id;
    try {     
        const friendRequests = await getFriendRequestsService(userId);
        return res.status(200).json({ friendRequests });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
export const getFriendsListController = async (req, res) => {
    const userId = req.user.id;
    try {
        const friendsList = await getFriendsListService(userId);
        return res.status(200).json({ friends: friendsList });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};