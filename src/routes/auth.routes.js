//
import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  signUp,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = router();

// normal routes
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
// route for password reset - when anyone clicks on mail password rest link(which we have sent)
router.post("/password/forgot", forgotPassword);
// route for reset password
router.post("/password/forgot:token", resetPassword);

// special routes
router.get("/profile", isLoggedIn, getProfile);

export default router;
