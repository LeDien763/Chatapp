import { addFriendService, 
    acceptFriendRequestService, 
    rejectFriendRequestService, 
    getFriendRequestsService, 
    getFriendsListService } from "../services/friendService";
export const addFriendController = async (req, res) => {
    const requesterId = req.user.id;
    const { recipientId, message } = req.body;

    try {
        await addFriendService(requesterId, recipientId, message);
        res.status(201).json({ message: "Friend request sent successfully." });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
export const acceptFriendRequestController = async (req, res) => {
    const recipientId = req.user.id;
    const { requestId } = req.params;
    try {        await acceptFriendRequestService(requestId, recipientId);
        res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
export const rejectFriendRequestController = async (req, res) => {
    const recipientId = req.user.id;
    const { requestId } = req.params;
    try {
        await rejectFriendRequestService(requestId, recipientId);
        res.status(200).json({ message: "Friend request rejected." });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
export const getFriendRequestsController = async (req, res) => {
    const userId = req.user.id;
    try {     
        const friendRequests = await getFriendRequestsService(userId);
        res.status(200).json({ friendRequests });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
export const getFriendsListController = async (req, res) => {
    const userId = req.user.id;
    try {
        const friendsList = await getFriendsListService(userId);
        res.status(200).json({ friends: friendsList });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};