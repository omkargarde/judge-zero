import { Router } from "express";

import { validate } from "../../middleware/validator.middleware.ts";
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
import { userEmailVerificationSchema } from "./auth.validator.ts";

const router = Router();

router.post(
  "/verify/:token",

  validate(userEmailVerificationSchema),
  verifyUser
);
router.post("/login", userLoginValidator(), validate, loginUser);
router.post("/register", userRegistrationValidator(), validate, registerUser);
router.get("/me", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export { router as authRouter };
