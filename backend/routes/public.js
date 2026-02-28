import { Router } from "express";
import Portfolio from "../models/Portfolio.js";

const router = Router();

// GET /api/public/:subdomain
router.get("/:subdomain", async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({
            subdomain: req.params.subdomain.toLowerCase(),
            status: "published",
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                error: { message: "Portfolio not found", code: "NOT_FOUND" },
            });
        }

        // Increment view count
        portfolio.views += 1;
        await portfolio.save();

        res.json({
            success: true,
            data: {
                templateId: portfolio.templateId,
                templateSlug: portfolio.templateSlug,
                data: portfolio.data,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch portfolio", code: "FETCH_ERROR" },
        });
    }
});

export default router;
