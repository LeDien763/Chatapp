import { addFriendController, 
    acceptFriendRequestController,
    rejectFriendRequestController,
    getFriendRequestsController, 
    getFriendsListController } from "../controllers/friendController";
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/add", authenticateToken, addFriendController);
router.post("/accept/:requestId", authenticateToken, acceptFriendRequestController);
router.post("/reject/:requestId", authenticateToken, rejectFriendRequestController);
router.get("/requests", authenticateToken, getFriendRequestsController);
router.get("/friends", authenticateToken, getFriendsListController);
export default router;