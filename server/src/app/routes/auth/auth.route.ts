import { Router } from "express";

import {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "./auth.controller.ts";
import { isLoggedIn } from "./auth.middleware.ts";

const router = Router();

router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export { router as authRouter };
