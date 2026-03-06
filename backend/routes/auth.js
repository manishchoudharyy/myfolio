import { Router } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendEmail } from "../utils/email.js";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper: Format user response
const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatar,
    authProvider: user.authProvider,
});

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

// =====================================================
// POST /api/auth/send-otp — Send OTP via Email
// =====================================================
router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: { message: "Email is required", code: "MISSING_EMAIL" },
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: { message: "Invalid email format.", code: "INVALID_EMAIL" },
            });
        }

        // Generate 6 digit OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this email
        await Otp.deleteMany({ email });

        // Save new OTP
        await Otp.create({ email, otp: generatedOtp });

        // Send OTP via Email
        try {
            await sendEmail({
                email,
                subject: "Your MyFolio Verification Code",
                message: `Your verification code is: ${generatedOtp}. This code is valid for 10 minutes.`,
            });
            console.log(`[Development] OTP for ${email}: ${generatedOtp}`); // For easy dev test without email
        } catch (err) {
            console.error("Email Send Error:", err);
            console.log(`[Development Fallback] OTP for ${email}: ${generatedOtp}`);
        }

        res.json({
            success: true,
            data: {
                email,
                message: "OTP sent successfully",
            },
        });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to send OTP", code: "OTP_ERROR" },
        });
    }
});

// =====================================================
// POST /api/auth/verify-otp — Verify OTP
// =====================================================
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: { message: "Email and OTP are required", code: "MISSING_FIELDS" },
            });
        }

        // Verify OTP from DB
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                error: { message: "Invalid or expired OTP. Please try again.", code: "INVALID_OTP" },
            });
        }

        // OTP Valid - Delete it
        await Otp.deleteMany({ email });

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email });

        res.json({
            success: true,
            data: {
                verified: true,
                email,
                userExists: !!existingUser,
                message: "OTP verified successfully",
            },
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "OTP verification failed", code: "VERIFY_ERROR" },
        });
    }
});

// =====================================================
// POST /api/auth/register — Register with email + password
// =====================================================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: { message: "Name, email, and password are required", code: "MISSING_FIELDS" },
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: { message: "Password must be at least 6 characters", code: "WEAK_PASSWORD" },
            });
        }

        // Check if email already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: { message: "Email already registered. Please login.", code: "EMAIL_EXISTS" },
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            authProvider: "email",
            isEmailVerified: true,
        });

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: { token, user: formatUser(user) },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Registration failed", code: "REGISTER_ERROR" },
        });
    }
});

// =====================================================
// POST /api/auth/login — Login with email + password
// =====================================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: { message: "Email and password are required", code: "MISSING_FIELDS" },
            });
        }

        // Find user with password included
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: "Account not found. Please sign up first.", code: "USER_NOT_FOUND" },
            });
        }

        if (!user.password) {
            return res.status(401).json({
                success: false,
                error: { message: "This account uses Google login. Please use Google to sign in.", code: "WRONG_PROVIDER" },
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: { message: "Incorrect password", code: "WRONG_PASSWORD" },
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: { token, user: formatUser(user) },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Login failed", code: "LOGIN_ERROR" },
        });
    }
});

export default router;
