//
import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupon,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = router();

// "/coupon" - is the final route, which comes by routes/index.js
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCoupon);
// params pass as id, (pass as id because we are requesting like this - "const { id: couponId } = req.params;" - (getting id but using as couponId) )
router.delete(
  "/:id",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  createCoupon
);
// route for update
router.put(
  "/action",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  updateCoupon
);
// getting all coupons
router.get(
  "/",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  getAllCoupon
);
// getting one coupon
router.get(
  "/:id",
  isLoggedIn,
  authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
  getAllCoupon
);

export default router;
