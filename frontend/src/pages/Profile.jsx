import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    UserCircle2, Lock, Trash2, Save, Eye, EyeOff,
    CheckCircle2, AlertCircle, Loader2, ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNav from "../components/DashboardNav";
import ImageUpload from "../components/shared/ImageUpload";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";

// ─── Section card wrapper ───────────────────────────────────────────
const Card = ({ title, icon: Icon, iconColor = "text-blue-600", iconBg = "bg-blue-50", children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// ─── Inline message ─────────────────────────────────────────────────
const Msg = ({ type, text }) => {
    if (!text) return null;
    const isErr = type === "error";
    return (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4
                ${isErr ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-green-50 border border-green-200 text-green-700"}`}>
            {isErr ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {text}
        </motion.div>
    );
};

// ─── Profile Page ────────────────────────────────────────────────────
const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const isGoogleUser = !!user?.googleId;

    // Profile
    const [name, setName] = useState(user?.name || "");
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
    const [avatarFile, setAvatarFile] = useState(null); // raw File object
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

    // Password
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

    // Delete portfolio
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Keep local avatar in sync with the ImageUpload component.
    // When ImageUpload uploads to Cloudinary it gives us back a URL.
    // But for PATCH we also need to support uploading via the user/update endpoint.
    // So: if avatar changed via ImageUpload (Cloudinary URL), send no file in formData.
    // That URL will be passed as "avatarUrl" in the form body.
    const handleSaveProfile = async () => {
        if (!name.trim()) {
            setProfileMsg({ type: "error", text: "Name cannot be empty." });
            return;
        }
        setProfileSaving(true);
        setProfileMsg({ type: "", text: "" });
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            // avatarUrl already uploaded to Cloudinary via ImageUpload component
            if (avatarUrl !== (user?.avatar || "")) {
                formData.append("avatarUrl", avatarUrl);
            }

            const res = await userAPI.update(formData);
            // Update context
            if (setUser) setUser((u) => ({ ...u, name: res.data.data.name, avatar: res.data.data.avatar }));
            setProfileMsg({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setProfileMsg({ type: "error", text: err.response?.data?.error?.message || "Update failed." });
        } finally {
            setProfileSaving(false);
        }
    };

    // Change password
    const handleChangePassword = async () => {
        if (!currentPw || !newPw || !confirmPw) {
            setPwMsg({ type: "error", text: "Please fill all fields." });
            return;
        }
        if (newPw.length < 6) {
            setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
            return;
        }
        if (newPw !== confirmPw) {
            setPwMsg({ type: "error", text: "Passwords do not match." });
            return;
        }
        setPwSaving(true);
        setPwMsg({ type: "", text: "" });
        try {
            await userAPI.changePassword(currentPw, newPw);
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
            setPwMsg({ type: "success", text: "Password changed successfully!" });
        } catch (err) {
            setPwMsg({ type: "error", text: err.response?.data?.error?.message || "Change failed." });
        } finally {
            setPwSaving(false);
        }
    };

    // Delete portfolio
    const handleDeletePortfolio = async () => {
        setDeleting(true);
        try {
            await userAPI.deletePortfolio();
            setShowDeleteConfirm(false);
            setDeleteInput("");
            navigate("/dashboard");
        } catch (err) {
            setShowDeleteConfirm(false);
            setProfileMsg({ type: "error", text: err.response?.data?.error?.message || "Delete failed." });
        } finally {
            setDeleting(false);
        }
    };

    const PwField = ({ label, field, value, onChange }) => (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={showPw[field] ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                />
                <button type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <DashboardNav />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage your account details and preferences.</p>
                </motion.div>

                {/* ── 1. Personal Info ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Card title="Personal Information" icon={UserCircle2}>
                        <Msg type={profileMsg.type} text={profileMsg.text} />

                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                            <ImageUpload
                                value={avatarUrl}
                                onChange={setAvatarUrl}
                                shape="circle"
                                placeholder="Upload Photo"
                            />
                            <div>
                                <p className="font-medium text-slate-800 text-sm">Profile Photo</p>
                                <p className="text-xs text-slate-400 mt-1">JPG, PNG or WebP · Max 5 MB</p>
                                <p className="text-xs text-slate-400">Shown on your portfolio.</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Email / Phone — read only */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {user?.email ? "Email" : "Phone"}
                            </label>
                            <div className="w-full px-4 py-2.5 border border-slate-100 rounded-xl text-sm bg-slate-50 text-slate-400 flex items-center justify-between">
                                <span>{user?.email || user?.phone || "—"}</span>
                                <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                                    {isGoogleUser ? "Google account" : "Read-only"}
                                </span>
                            </div>
                        </div>

                        <button onClick={handleSaveProfile} disabled={profileSaving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm">
                            {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {profileSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </Card>
                </motion.div>

                {/* ── 2. Change Password (phone users only) ── */}
                {!isGoogleUser && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card title="Change Password" icon={Lock} iconColor="text-violet-600" iconBg="bg-violet-50">
                            <Msg type={pwMsg.type} text={pwMsg.text} />
                            <div className="space-y-4">
                                <PwField label="Current Password" field="current" value={currentPw} onChange={setCurrentPw} />
                                <PwField label="New Password" field="new" value={newPw} onChange={setNewPw} />
                                <PwField label="Confirm Password" field="confirm" value={confirmPw} onChange={setConfirmPw} />
                            </div>
                            <button onClick={handleChangePassword} disabled={pwSaving}
                                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 disabled:opacity-60 transition-colors shadow-sm">
                                {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                {pwSaving ? "Saving..." : "Update Password"}
                            </button>
                        </Card>
                    </motion.div>
                )}

                {/* ── 3. Danger Zone ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Card title="Danger Zone" icon={ShieldAlert} iconColor="text-red-600" iconBg="bg-red-50">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-medium text-slate-800 text-sm">Delete Portfolio</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Permanently removes your portfolio and all its content. Cannot be undone.
                                </p>
                            </div>
                            <button onClick={() => setShowDeleteConfirm(true)}
                                className="shrink-0 flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </Card>
                </motion.div>
            </main>

            {/* ── Delete Portfolio Modal ── */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}>
                    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-slate-900 mb-1">Delete Portfolio?</h3>
                        <p className="text-sm text-center text-slate-500 mb-5">
                            This will permanently delete your portfolio. Type{" "}
                            <span className="font-mono font-bold text-red-600">DELETE</span> to confirm.
                        </p>
                        <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder='Type "DELETE" to confirm'
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-center mb-4 focus:outline-none focus:ring-2 focus:ring-red-400" />
                        <div className="flex gap-3">
                            <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button onClick={handleDeletePortfolio}
                                disabled={deleteInput !== "DELETE" || deleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed">
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Profile;
