export const updateConversationAfterCreatingMessage = async (conversationId, messageId, senderId) => {
  try{
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw { status: 404, message: "Conversation not found." };
    }
  }
  catch (error) {
    console.error("Error updating conversation after creating message:", error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    throw { status, message };
  }
}; 