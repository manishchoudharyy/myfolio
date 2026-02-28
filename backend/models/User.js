import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            sparse: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        avatar: {
            type: String,
            default: "",
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true,
        },
        authProvider: {
            type: String,
            enum: ["google", "phone"],
            required: true,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
