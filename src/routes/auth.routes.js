//
import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  signUp,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = router();

// normal routes
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

// special routes
router.get("/profile", isLoggedIn, getProfile);

export default router;
