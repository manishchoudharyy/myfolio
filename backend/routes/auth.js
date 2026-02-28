import { Router } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// =====================================================
// POST /api/auth/google — Google OAuth Login/Signup
// =====================================================
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                error: { message: "Google credential is required", code: "MISSING_CREDENTIAL" },
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, name, email, picture } = payload;

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.create({
                googleId,
                name,
                email,
                avatar: picture || "",
                authProvider: "google",
            });
        } else {
            user.name = name;
            user.avatar = picture || user.avatar;
            await user.save();
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: { token, user: formatUser(user) },
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({
            success: false,
            error: { message: "Authentication failed", code: "AUTH_FAILED" },
        });
    }
});



export default router;
