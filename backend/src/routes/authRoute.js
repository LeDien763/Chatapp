import express from 'express';
import { signUpController,signInController, signOutController } from '../controllers/authController.js';
const router = express.Router();
router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/signout", signOutController); 
export default router;