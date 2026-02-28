import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        templateId: {
            type: String,
            required: true,
        },
        templateSlug: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        subdomain: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        data: {
            name: { type: String, default: "" },
            title: { type: String, default: "" },
            about: { type: String, default: "" },
            avatar: { type: String, default: "" },
            skills: [
                {
                    name: { type: String },
                    level: { type: String, default: "Intermediate" },
                },
            ],
            education: [
                {
                    institution: { type: String },
                    degree: { type: String },
                    field: { type: String },
                    startYear: { type: String },
                    endYear: { type: String },
                    description: { type: String },
                },
            ],
            experience: [
                {
                    company: { type: String },
                    role: { type: String },
                    startDate: { type: String },
                    endDate: { type: String },
                    description: { type: String },
                    current: { type: Boolean, default: false },
                },
            ],
            projects: [
                {
                    title: { type: String },
                    description: { type: String },
                    techStack: [String],
                    liveUrl: { type: String },
                    githubUrl: { type: String },
                },
            ],
            certificates: [
                {
                    title: { type: String },
                    issuer: { type: String },
                    date: { type: String },
                    url: { type: String },
                },
            ],
            contact: {
                email: { type: String, default: "" },
                phone: { type: String, default: "" },
                linkedin: { type: String, default: "" },
                github: { type: String, default: "" },
                twitter: { type: String, default: "" },
                website: { type: String, default: "" },
            },
        },
    },
    { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
