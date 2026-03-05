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
const Card = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <h2 className="font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
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
        <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">{label}</label>
            <div className="relative">
                <input
                    type={showPw[field] ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm text-slate-900 focus:bg-white focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all pr-10"
                    placeholder="••••••••"
                />
                <button type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <DashboardNav />

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 pb-24">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage your personal information and preferences.</p>
                </motion.div>

                {/* ── 1. Personal Info ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Card title="Personal Information" icon={UserCircle2}>
                        <Msg type={profileMsg.type} text={profileMsg.text} />

                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                            <ImageUpload
                                value={avatarUrl}
                                onChange={setAvatarUrl}
                                shape="circle"
                                placeholder="Upload Photo"
                            />
                            <div className="text-center sm:text-left">
                                <p className="font-bold text-slate-900 text-sm">Profile Photo</p>
                                <p className="text-sm text-slate-500 mt-1">Recommended size 400x400px. <br className="hidden sm:block" />JPG, PNG or WebP under 5 MB.</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm text-slate-900 focus:bg-white focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all font-medium"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Email / Phone — read only */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                                {user?.email ? "Email Address" : "Phone Number"}
                            </label>
                            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm text-slate-500 flex items-center justify-between font-medium cursor-not-allowed">
                                <span>{user?.email || user?.phone || "—"}</span>
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-bold tracking-wider uppercase">
                                    {isGoogleUser ? "Google Auth" : "Read-only"}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={handleSaveProfile} disabled={profileSaving}
                                className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-60 transition-all shadow-sm focus:ring-4 focus:ring-slate-200">
                                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {profileSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </Card>
                </motion.div>

                {/* ── 2. Change Password (phone users only) ── */}
                {!isGoogleUser && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card title="Change Password" icon={Lock}>
                            <Msg type={pwMsg.type} text={pwMsg.text} />
                            <div className="space-y-1 mb-8">
                                <PwField label="Current Password" field="current" value={currentPw} onChange={setCurrentPw} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <PwField label="New Password" field="new" value={newPw} onChange={setNewPw} />
                                    <PwField label="Confirm Password" field="confirm" value={confirmPw} onChange={setConfirmPw} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleChangePassword} disabled={pwSaving}
                                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-60 transition-all shadow-sm focus:ring-4 focus:ring-slate-200">
                                    {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    {pwSaving ? "Changing..." : "Update Password"}
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* ── 3. Danger Zone ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Card title="Danger Zone" icon={ShieldAlert}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Delete Portfolio</p>
                                <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                                    Permanently removes your portfolio and all its contents from our servers. This action is irreversible.
                                </p>
                            </div>
                            <button onClick={() => setShowDeleteConfirm(true)}
                                className="shrink-0 flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-bold transition-all focus:ring-4 focus:ring-red-100">
                                <Trash2 className="w-4 h-4" /> Delete Portfolio
                            </button>
                        </div>
                    </Card>
                </motion.div>
            </main>

            {/* ── Delete Portfolio Modal ── */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}>
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 w-full max-w-sm relative">
                        <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-5">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Portfolio?</h3>
                        <p className="text-sm font-medium text-slate-500 mb-6">
                            This will permanently delete your portfolio. Type <span className="font-mono font-bold text-red-600 select-all tracking-wider bg-red-50 px-1 py-0.5 rounded">DELETE</span> to confirm.
                        </p>
                        <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder='Type "DELETE"'
                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm text-center mb-6 focus:bg-white focus:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold placeholder-slate-400" />
                        <div className="flex gap-3">
                            <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                                className="flex-1 px-4 py-3 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDeletePortfolio}
                                disabled={deleteInput !== "DELETE" || deleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:bg-red-600 disabled:cursor-not-allowed transition-all focus:ring-4 focus:ring-red-200">
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                {deleting ? "Wait..." : "Delete"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Profile;
