import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        portfolioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Portfolio",
            default: null,
        },
        phase: {
            type: String,
            enum: ["collection", "refinement"],
            default: "collection",
        },
        messages: [
            {
                role: {
                    type: String,
                    enum: ["user", "assistant"],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        collectedData: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Index for quick lookup
chatSessionSchema.index({ userId: 1, status: 1 });

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
