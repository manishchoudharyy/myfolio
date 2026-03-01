import mongoose from "mongoose";

/**
 * Resume Model
 * ============
 * Stores every resume a user has ever uploaded.
 * Only one document per user has isReplaced: false — that's the active one.
 * When user uploads a new resume, the old one is marked isReplaced: true
 * but kept in DB and Cloudinary for full history.
 */
const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Cloudinary fields
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },

        // File metadata
        name: {
            type: String,
            required: true,
        },
        size: {
            type: String,   // e.g. "245 KB"
            default: "",
        },

        // Version tracking
        // false = this is the current active resume
        // true  = this was replaced by a newer upload
        isReplaced: {
            type: Boolean,
            default: false,
        },

        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index to quickly find the active resume for a user
resumeSchema.index({ userId: 1, isReplaced: 1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;