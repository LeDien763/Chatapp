import { sendFriendRequestController, 
    acceptFriendRequestController,
    rejectFriendRequestController,
    getFriendRequestsController, 
    getFriendsListController } from "../controllers/friendController";
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/send", authenticateToken, sendFriendRequestController);
router.post("/accept/:requestId", authenticateToken, acceptFriendRequestController);
router.post("/reject/:requestId", authenticateToken, rejectFriendRequestController);
router.get("/requests", authenticateToken, getFriendRequestsController);
router.get("/", authenticateToken, getFriendsListController);
export default router;