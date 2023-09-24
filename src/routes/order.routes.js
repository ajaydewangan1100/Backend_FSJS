//
import { Router } from "express";
import {
  generateOrder,
  getAllOrders,
  getMyOrders,
  updateOrders,
  generateRazorpayOrderId,
} from "../controllers/order.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = router();

// TODO : add all routes
//

export default router;
