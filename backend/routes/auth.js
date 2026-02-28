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
// POST /api/auth/send-otp — Send OTP via 2Factor API
// =====================================================
router.post("/send-otp", async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                error: { message: "Phone number is required", code: "MISSING_PHONE" },
            });
        }

        // Validate Indian phone number (10 digits)
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        if (cleanPhone.length !== 10) {
            return res.status(400).json({
                success: false,
                error: { message: "Invalid phone number. Enter 10-digit number.", code: "INVALID_PHONE" },
            });
        }

        // Send OTP via 2Factor API
        const apiKey = process.env.TWO_FACTOR_API_KEY;
        const response = await fetch(
            `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhone}/AUTOGEN`,
        );
        const data = await response.json();

        if (data.Status !== "Success") {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to send OTP. Try again.", code: "OTP_SEND_FAILED" },
            });
        }

        res.json({
            success: true,
            data: {
                sessionId: data.Details,
                phone: cleanPhone,
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
// POST /api/auth/verify-otp — Verify OTP via 2Factor API
// =====================================================
router.post("/verify-otp", async (req, res) => {
    try {
        const { phone, sessionId, otp } = req.body;

        if (!phone || !sessionId || !otp) {
            return res.status(400).json({
                success: false,
                error: { message: "Phone, sessionId, and OTP are required", code: "MISSING_FIELDS" },
            });
        }

        // Verify OTP via 2Factor API
        const apiKey = process.env.TWO_FACTOR_API_KEY;
        const response = await fetch(
            `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`,
        );
        const data = await response.json();

        if (data.Status !== "Success") {
            return res.status(400).json({
                success: false,
                error: { message: "Invalid OTP. Please try again.", code: "INVALID_OTP" },
            });
        }

        // Check if user already exists with this phone
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        const existingUser = await User.findOne({ phone: cleanPhone });

        res.json({
            success: true,
            data: {
                verified: true,
                phone: cleanPhone,
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
// POST /api/auth/register — Register with phone + password
// =====================================================
router.post("/register", async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({
                success: false,
                error: { message: "Name, phone, and password are required", code: "MISSING_FIELDS" },
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: { message: "Password must be at least 6 characters", code: "WEAK_PASSWORD" },
            });
        }

        const cleanPhone = phone.replace(/\D/g, "").slice(-10);

        // Check if phone already registered
        const existingUser = await User.findOne({ phone: cleanPhone });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: { message: "Phone number already registered. Please login.", code: "PHONE_EXISTS" },
            });
        }

        const user = await User.create({
            name,
            phone: cleanPhone,
            password,
            authProvider: "phone",
            isPhoneVerified: true,
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
// POST /api/auth/login — Login with phone + password
// =====================================================
router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                error: { message: "Phone and password are required", code: "MISSING_FIELDS" },
            });
        }

        const cleanPhone = phone.replace(/\D/g, "").slice(-10);

        // Find user with password included
        const user = await User.findOne({ phone: cleanPhone }).select("+password");

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
