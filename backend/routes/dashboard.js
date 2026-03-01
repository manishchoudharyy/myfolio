import { Router } from "express";
import auth from "../middleware/auth.js";
import Portfolio from "../models/Portfolio.js";

const router = Router();

// GET /api/dashboard
router.get("/", auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user._id });

        if (!portfolio) {
            return res.json({
                success: true,
                data: { portfolio: null },
            });
        }

        res.json({
            success: true,
            data: {
                portfolio: {
                    id: portfolio._id,
                    templateId: portfolio.templateId,
                    templateSlug: portfolio.templateSlug,
                    status: portfolio.status,
                    subdomain: portfolio.subdomain,
                    views: portfolio.views,
                    updatedAt: portfolio.updatedAt,
                    data: portfolio.data,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch dashboard", code: "FETCH_ERROR" },
        });
    }
});

export default router;
