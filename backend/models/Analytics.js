import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    portfolioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ipAddress: {
        type: String,
        default: null,
    },
    userAgent: {
        type: String,
        default: null,
    },
    deviceType: {
        type: String,
        enum: ["desktop", "mobile", "tablet"],
        default: "desktop"
    },
    referrer: {
        type: String,
        default: null,
    },
    visitedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Analytics", analyticsSchema);
