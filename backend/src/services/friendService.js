export const addFriendService = async (requesterId, recipientId, message) => {
    if (requesterId === recipientId) {
        throw { status: 400, message: "You cannot send a friend request to yourself." };
    }

    // Implementation for adding a friend request
};
export const acceptFriendRequestService = async (requestId, recipientId) => {
};
export const rejectFriendRequestService = async (requestId, recipientId) => {
};
export const removeFriendService = async (userId, friendId) => {
}
export const getFriendsListService = async (userId) => {
}
export const getFriendRequestsService = async (userId) => {
}