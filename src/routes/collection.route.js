//
//
import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  getCollection,
  getAllCollection,
  updateCollection,
} from "../controllers/collection.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = router();

// route for create collection
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCollection);
// route for update
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateCollection);
// delete
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteCollection);
// getAll
router.get("/", getAllCollection);
// get One
router.get("/:id", getCollection);

export default router;
