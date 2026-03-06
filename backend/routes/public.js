import { Router } from "express";
import Portfolio from "../models/Portfolio.js";
import Analytics from "../models/Analytics.js";

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

        // Track analytics
        const userAgent = req.headers["user-agent"] || "";
        const referrer = req.headers.referer || req.headers.referrer || "";
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

        let deviceType = "desktop";
        if (/mobile/i.test(userAgent)) deviceType = "mobile";
        if (/ipad|tablet|playbook|silk/i.test(userAgent)) deviceType = "tablet";

        try {
            await Analytics.create({
                portfolioId: portfolio._id,
                userId: portfolio.userId,
                ipAddress,
                userAgent,
                deviceType,
                referrer
            });
        } catch (analyticsErr) {
            console.error("Failed to track analytics:", analyticsErr);
        }

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
