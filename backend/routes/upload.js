import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import auth from "../middleware/auth.js";
import multer from "multer";

const router = Router();

// Multer — keep image in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed"), false);
    },
});

// Cloudinary config — reads from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload/image
// Upload a single image → returns { url }
router.post("/image", auth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: { message: "No image file provided", code: "NO_FILE" },
            });
        }

        // Upload to Cloudinary via stream
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "myfolio",
                    resource_type: "image",
                    transformation: [
                        { width: 800, height: 800, crop: "limit" }, // max 800x800
                        { quality: "auto", fetch_format: "auto" },
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
            },
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Image upload failed", code: "UPLOAD_ERROR" },
        });
    }
});

export default router;
