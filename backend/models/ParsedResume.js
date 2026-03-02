import mongoose from "mongoose";

/**
 * ParsedResume Model
 * ==================
 * Stores AI-extracted structured data from a user's resume PDF.
 *
 * Separate from Resume model (which stores the raw PDF on Cloudinary).
 * A new ParsedResume document is created each time user re-parses.
 * The latest one (isActive: true) is the current parsed data.
 *
 * Structure of `data` field follows the portfolio schema:
 * {
 *   name, title, about, avatar,
 *   skills: [...],
 *   experience: [{ company, role, duration, description }],
 *   education: [{ institution, degree, duration }],
 *   projects: [{ name, description, tech, url }],
 *   contact: { email, phone, linkedin, github, website }
 * }
 */
const parsedResumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Link back to the Resume (PDF) this was parsed from — optional
        // Null if parsed from an already-stored resume
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            default: null,
        },

        // The AI-structured portfolio data extracted from the resume
        data: {
            type: Object,
            required: true,
        },

        // Source of text extraction (for debugging)
        rawTextLength: {
            type: Number,
            default: 0,
        },

        // Only ONE ParsedResume per user is active at a time.
        // When user re-parses, old one becomes isActive: false.
        isActive: {
            type: Boolean,
            default: true,
        },

        parsedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Quick lookup of current active parsed data for a user
parsedResumeSchema.index({ userId: 1, isActive: 1 });

const ParsedResume = mongoose.model("ParsedResume", parsedResumeSchema);
export default ParsedResume;
