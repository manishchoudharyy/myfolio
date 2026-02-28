import { Router } from "express";
import auth from "../middleware/auth.js";

const router = Router();

// GET /api/user/me
router.get("/me", auth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Server error", code: "SERVER_ERROR" },
        });
    }
});

export default router;
