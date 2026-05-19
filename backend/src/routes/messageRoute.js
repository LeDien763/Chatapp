import express from 'express';
import { sendDirectMessageController,
    sendGroupMessageController,
    getDirectMessagesController,
    getGroupMessagesController
 } from '../controllers/messageController';

const router = express.Router();

router.post('/direct', sendDirectMessageController);
router.post('/group', sendGroupMessageController);
router.get('/direct/:friendId', getDirectMessagesController);
router.get('/group/:groupId', getGroupMessagesController);

export default router;