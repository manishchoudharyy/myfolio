import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import auth from "../middleware/auth.js";
import multer from "multer";
import Resume from "../models/Resume.js";

const router = Router();

// Multer — PDF only, in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files are allowed"), false);
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Helpers ───────────────────────────────────────────────────────────
function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
        stream.end(buffer);
    });
}

// ─── GET /api/resume/my ────────────────────────────────────────────────
// Get user's current active resume
router.get("/my", auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            userId: req.user._id,
            isReplaced: false,
        });

        res.json({
            success: true,
            data: resume || null,
        });
    } catch (error) {
        console.error("Get Resume Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Server error", code: "SERVER_ERROR" },
        });
    }
});

// ─── GET /api/resume/history ───────────────────────────────────────────
// Get all resumes (current + replaced) for a user
router.get("/history", auth, async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id })
            .sort({ uploadedAt: -1 });

        res.json({ success: true, data: resumes });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Server error", code: "SERVER_ERROR" },
        });
    }
});

// ─── POST /api/resume/upload ───────────────────────────────────────────
// Upload new resume PDF → mark old one as replaced
router.post("/upload", auth, upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: { message: "PDF file is required", code: "NO_FILE" },
            });
        }

        // Upload to Cloudinary as raw file (PDF)
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: "myfolio/resumes",
            resource_type: "raw",
            format: "pdf",
            public_id: `resume_${req.user._id}_${Date.now()}`,
        });

        // Mark existing active resume as replaced
        await Resume.updateMany(
            { userId: req.user._id, isReplaced: false },
            { $set: { isReplaced: true } }
        );

        // Create new resume document
        const resume = await Resume.create({
            userId: req.user._id,
            url: result.secure_url,
            publicId: result.public_id,
            name: req.file.originalname,
            size: formatSize(req.file.size),
            uploadedAt: new Date(),
            isReplaced: false,
        });

        res.json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Resume upload failed", code: "UPLOAD_ERROR" },
        });
    }
});

// ─── DELETE /api/resume/delete ─────────────────────────────────────────
// Soft-delete: marks current resume as replaced (keeps file + history)
router.delete("/delete", auth, async (req, res) => {
    try {
        const updated = await Resume.findOneAndUpdate(
            { userId: req.user._id, isReplaced: false },
            { $set: { isReplaced: true } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: { message: "No active resume found", code: "NOT_FOUND" },
            });
        }

        res.json({ success: true, message: "Resume removed" });
    } catch (error) {
        console.error("Delete Resume Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Server error", code: "SERVER_ERROR" },
        });
    }
});

export default router;
