import { sendFriendRequestController, 
    acceptFriendRequestController,
    rejectFriendRequestController,
    getFriendRequestsController, 
    getFriendsListController } from "../controllers/friendController.js";
import express from "express";
const router = express.Router();
router.post("/send", sendFriendRequestController);
router.post("/accept/:requestId", acceptFriendRequestController);
router.post("/reject/:requestId", rejectFriendRequestController);
router.get("/requests", getFriendRequestsController);
router.get("/", getFriendsListController);
export default router;