import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";

const router = Router();

// Multer for avatar image
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed"), false);
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadImageToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
        stream.end(buffer);
    });
}

// ─── GET /api/user/me ──────────────────────────────────────────────────
router.get("/me", auth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                avatar: req.user.avatar,
                authProvider: req.user.authProvider,
                googleId: req.user.googleId,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: { message: "Server error" } });
    }
});

// ─── PATCH /api/user/update ────────────────────────────────────────────
// Update name and/or upload avatar image
router.patch("/update", auth, upload.single("avatar"), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, error: { message: "User not found" } });

        // Update name
        if (req.body.name && req.body.name.trim()) {
            user.name = req.body.name.trim();
        }

        // Case 1: Cloudinary URL already uploaded by frontend (via ImageUpload component)
        if (req.body.avatarUrl && req.body.avatarUrl !== user.avatar) {
            user.avatar = req.body.avatarUrl;
        }

        // Case 2: Raw image file uploaded directly
        if (req.file) {
            // Delete old avatar from Cloudinary
            if (user.avatarPublicId) {
                await cloudinary.uploader.destroy(user.avatarPublicId).catch(() => { });
            }
            const result = await uploadImageToCloudinary(req.file.buffer, {
                folder: "myfolio/avatars",
                resource_type: "image",
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "face" },
                    { quality: "auto", fetch_format: "auto" },
                ],
            });
            user.avatar = result.secure_url;
            user.avatarPublicId = result.public_id;
        }

        await user.save();

        res.json({
            success: true,
            data: { id: user._id, name: user.name, avatar: user.avatar },
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ success: false, error: { message: "Update failed" } });
    }
});

// ─── PATCH /api/user/change-password ──────────────────────────────────
// Only for phone-based users (not Google OAuth)
router.patch("/change-password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: { message: "Both current and new password are required" },
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: { message: "New password must be at least 6 characters" },
            });
        }

        // Fetch user with password
        const user = await User.findById(req.user._id).select("+password");

        if (user.authProvider === "google") {
            return res.status(400).json({
                success: false,
                error: { message: "Google accounts cannot change password here" },
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: { message: "Current password is incorrect", code: "WRONG_PASSWORD" },
            });
        }

        user.password = newPassword; // pre-save hook will hash it
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ success: false, error: { message: "Server error" } });
    }
});

// ─── DELETE /api/user/portfolio ────────────────────────────────────────
// Delete user's portfolio
router.delete("/portfolio", auth, async (req, res) => {
    try {
        const deleted = await Portfolio.findOneAndDelete({ userId: req.user._id });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: { message: "No portfolio found", code: "NOT_FOUND" },
            });
        }

        res.json({ success: true, message: "Portfolio deleted" });
    } catch (error) {
        console.error("Delete Portfolio Error:", error);
        res.status(500).json({ success: false, error: { message: "Server error" } });
    }
});

export default router;
