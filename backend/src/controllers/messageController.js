import { sendDirectMessageService,
        sendGroupMessageService, 
        getDirectMessagesService,
        getGroupMessagesService } from "../services/messageService.js";
export const sendDirectMessageController = async (req, res) => {
    try {
            const senderId = req.user._id;
            const { recipientId, content, imgUrl, conversationId } = req.body;
            let conversation;
            await sendDirectMessageService(senderId, recipientId, content, imgUrl, conversationId);
            return res.status(201).json({ message: "Message sent successfully." });
    }
    catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }

}
export const sendGroupMessageController = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { groupId, content } = req.body;
        await sendGroupMessageService(senderId, groupId, content);
        return res.status(201).json({ message: "Message sent successfully." });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
export const getDirectMessagesController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { friendId } = req.params;
        const messages = await getDirectMessagesService(userId, friendId);
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
export const getGroupMessagesController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { groupId } = req.params;
        const messages = await getGroupMessagesService(userId, groupId);
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};