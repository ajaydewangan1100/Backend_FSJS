import { Router } from "express";
import authRoutes from "./auth.routes.js";
import couponRouter from "./coupon.route.js";
import collectionRoutes from "./collection.route.js";

const router = router();

// why we need of this index.js for routes-
// because here we are importing all the routes and exporting from here so all routes accessible via here only
// here in router.use() - use() is a middleware
router.use("/auth", authRoutes);
router.use("/coupon", couponRouter);
router.use("/collection", collectionRoutes);

export default router;
