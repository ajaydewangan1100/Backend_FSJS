import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = router();

// why we need of this index.js for routes-
// because here we are importing all the routes and exporting from here so all routes accessible via here only
// here in router.use() - use() is a middleware 
router.use("/auth", authRoutes);

export default router;
