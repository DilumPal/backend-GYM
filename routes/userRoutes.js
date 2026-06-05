import express from 'express';
import { createUser, getUser, loginUser, loginWithGoogle, resetPassword, sendOTP, getAllUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword)
userRouter.get("/", getUser);
userRouter.get("/all", getAllUsers);

export default userRouter;