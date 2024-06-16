import express from "express";
const authRouter = express.Router();
import login from "../controllers/auth/login.js";
import signup from "../controllers/auth/signup.js";
import verifyOTP from "../controllers/auth/verificationCode.js";
import me from "../controllers/auth/me.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import resendOTP from "../controllers/auth/resendOtp.js";

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", verifyToken, me);
authRouter.post("/verification-phone", verifyOTP);
authRouter.post("/resend-otp", resendOTP);

export default authRouter;
