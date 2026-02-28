import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import seedTemplates from "./seeds/templateSeeder.js";

// Route imports
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import templateRoutes from "./routes/templates.js";
import portfolioRoutes from "./routes/portfolio.js";
import aiRoutes from "./routes/ai.js";
import dashboardRoutes from "./routes/dashboard.js";
import publicRoutes from "./routes/public.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "MyFolio API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);

// Connect DB and start server
const port = process.env.PORT || 8000;

connectDB().then(async () => {
    await seedTemplates();
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
});