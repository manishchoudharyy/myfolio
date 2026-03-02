import { Router } from "express";
import auth from "../middleware/auth.js";
import Portfolio from "../models/Portfolio.js";
import Template from "../models/Template.js";

const router = Router();

// POST /api/portfolio/create
router.post("/create", auth, async (req, res) => {

    try {
        const { templateId, templateSlug, data } = req.body;

        if (!templateId) {
            return res.status(400).json({
                success: false,
                error: { message: "Template ID is required", code: "MISSING_TEMPLATE" },
            });
        }

        // Resolve slug — use provided templateSlug, or look up from templateId
        let slug = templateSlug || templateId;
        const template = await Template.findById(templateId).catch(() => null);

        const portfolioData = data || {
            name: req.user.name,
            title: "",
            about: "",
            avatar: req.user.avatar,
            skills: [],
            education: [],
            experience: [],
            projects: [],
            certificates: [],
            contact: { email: req.user.email },
        };

        // Check if user already has a portfolio
        let portfolio = await Portfolio.findOne({ userId: req.user._id });

        if (portfolio) {
            // Overwrite with new template
            portfolio.templateId = templateId;
            portfolio.templateSlug = slug;
            portfolio.status = "draft";
            portfolio.data = portfolioData;
            await portfolio.save();
        } else {
            portfolio = await Portfolio.create({
                userId: req.user._id,
                templateId: templateId,
                templateSlug: slug,
                data: portfolioData,
            });
        }

        res.json({
            success: true,
            data: {
                portfolioId: portfolio._id,
                templateSlug: portfolio.templateSlug,
                status: portfolio.status,
            },
        });
    } catch (error) {
        console.error("Create Portfolio Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to create portfolio", code: "CREATE_ERROR" },
        });
    }

});

// GET /api/portfolio/:id
router.get("/:id", auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                error: { message: "Portfolio not found", code: "NOT_FOUND" },
            });
        }

        res.json({
            success: true,
            data: {
                id: portfolio._id,
                templateId: portfolio.templateId,
                templateSlug: portfolio.templateSlug,
                status: portfolio.status,
                subdomain: portfolio.subdomain,
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

// GET /api/portfolio/user/me — Get user's portfolio
router.get("/user/me", auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user._id });
        if (!portfolio) {
            return res.json({ success: true, data: null });
        }
        res.json({
            success: true,
            data: {
                id: portfolio._id,
                templateId: portfolio.templateId,
                templateSlug: portfolio.templateSlug,
                status: portfolio.status,
                subdomain: portfolio.subdomain,
                views: portfolio.views,
                data: portfolio.data,
                updatedAt: portfolio.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch portfolio", code: "FETCH_ERROR" },
        });
    }
});

// PATCH /api/portfolio/:id
router.patch("/:id", auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                error: { message: "Portfolio not found", code: "NOT_FOUND" },
            });
        }

        // Update portfolio data
        if (req.body.data) {
            portfolio.data = { ...portfolio.data.toObject(), ...req.body.data };
        }
        if (req.body.templateId) {
            // Resolve to slug if it's an ObjectId
            let slug = req.body.templateSlug || req.body.templateId;
            const tmpl = await Template.findById(req.body.templateId).catch(() => null);
            if (tmpl) slug = tmpl.slug;
            portfolio.templateId = req.body.templateId;
            portfolio.templateSlug = slug;
        }

        await portfolio.save();

        res.json({ success: true });
    } catch (error) {
        console.error("Update Portfolio Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to update portfolio", code: "UPDATE_ERROR" },
        });
    }
});

// POST /api/portfolio/check-subdomain
router.post("/check-subdomain", auth, async (req, res) => {
    try {
        const { subdomain } = req.body;
        if (!subdomain) {
            return res.status(400).json({
                success: false,
                error: { message: "Subdomain is required", code: "MISSING_SUBDOMAIN" },
            });
        }

        // Validate subdomain format
        const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
        if (!subdomainRegex.test(subdomain.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Subdomain must be 3-30 characters, alphanumeric and hyphens only",
                    code: "INVALID_FORMAT",
                },
            });
        }

        const existing = await Portfolio.findOne({
            subdomain: subdomain.toLowerCase(),
            userId: { $ne: req.user._id },
        });

        res.json({
            success: true,
            data: { available: !existing },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Failed to check subdomain", code: "CHECK_ERROR" },
        });
    }
});

// POST /api/portfolio/publish
router.post("/publish", auth, async (req, res) => {
    try {
        const { portfolioId, subdomain } = req.body;

        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.user._id,
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                error: { message: "Portfolio not found", code: "NOT_FOUND" },
            });
        }

        // Check subdomain availability
        const existing = await Portfolio.findOne({
            subdomain: subdomain.toLowerCase(),
            _id: { $ne: portfolioId },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: { message: "Subdomain already taken", code: "SUBDOMAIN_TAKEN" },
            });
        }

        portfolio.subdomain = subdomain.toLowerCase();
        portfolio.status = "published";
        await portfolio.save();

        res.json({
            success: true,
            data: {
                url: `https://${subdomain.toLowerCase()}.myfolio.fun`,
            },
        });
    } catch (error) {
        console.error("Publish Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to publish", code: "PUBLISH_ERROR" },
        });
    }
});

export default router;
