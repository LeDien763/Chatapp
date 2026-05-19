export const sendDirectMessageService = async (senderId, recipientId, content, imgUrl, conversationId) => {
    try {
        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }
        if (content === "" && !imgUrl) {
            throw { status: 400, message: "Message content cannot be empty." };
        }
        if (!conversation) {
            conversation = new Conversation({
                type: "direct",
                participants: [
                    { userId: senderId },
                    { userId: recipientId }
                ],
                lastMessageAt: new Date(),
                unreadCount: new Map()
            });
            await conversation.save();
        }
        const message = new Message({
            senderId,
            conversationId: conversation._id,
            content,
            imgUrl: imgUrl
        });
        await message.save();
    }
    catch (error) {
        throw { status: 500, message: "Failed to send message." };
    }
}
export const sendGroupMessageService = async (senderId, groupId, content) => {
    // Implement logic to save group message to the database
    // and update the group's last message and timestamp
}
export const getDirectMessagesService = async (userId, friendId) => {
    // Implement logic to retrieve direct messages between userId and friendId
    // Ensure that the user is a friend of friendId before fetching messages
}
export const getGroupMessagesService = async (userId, groupId) => {
    // Implement logic to retrieve messages for the specified groupId
    // Ensure that the user is a member of the group before fetching messages
}
