import { Router } from "express";
import Template from "../models/Template.js";

const router = Router();

// GET /api/templates
router.get("/", async (req, res) => {
    try {
        const templates = await Template.find().select("name description previewImage slug");
        res.json({
            success: true,
            data: templates,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch templates", code: "FETCH_ERROR" },
        });
    }
});

export default router;
