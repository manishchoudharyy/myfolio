import { Router } from "express";
import auth from "../middleware/auth.js";
import Portfolio from "../models/Portfolio.js";

import Analytics from "../models/Analytics.js";

const router = Router();

// GET /api/dashboard
router.get("/", auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user._id });

        if (!portfolio) {
            return res.json({
                success: true,
                data: { portfolio: null, analytics: null },
            });
        }

        // Get analytics
        const totalViews = await Analytics.countDocuments({ portfolioId: portfolio._id });

        // Views this month
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentViews = await Analytics.countDocuments({
            portfolioId: portfolio._id,
            visitedAt: { $gte: thirtyDaysAgo }
        });

        // Group by device
        const deviceStats = await Analytics.aggregate([
            { $match: { portfolioId: portfolio._id } },
            { $group: { _id: "$deviceType", count: { $sum: 1 } } }
        ]);

        const formattedDeviceStats = deviceStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { desktop: 0, mobile: 0, tablet: 0 });

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
                analytics: {
                    totalViews,
                    recentViews,
                    devices: formattedDeviceStats
                }
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
