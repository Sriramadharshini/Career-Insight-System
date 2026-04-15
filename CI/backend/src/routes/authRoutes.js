import { Router } from "express";
import { getMe, loginUser, registerUser, adminLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);
router.get("/me", protect, getMe);


export default router;
