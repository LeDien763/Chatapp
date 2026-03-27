import express from 'express';
import { signUpController,signInController, signOutController, refreshTokenController } from '../controllers/authController.js';
const router = express.Router();
router.post("/signup", signUpController);

router.post("/signin", signInController);

router.post("/signout", signOutController); 

router.post("/refresh", refreshTokenController);
export default router;