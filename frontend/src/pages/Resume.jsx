import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FileText, Trash2, RefreshCw, CheckCircle2,
    Loader2, AlertCircle, Download, Eye, FilePlus2, CloudUpload, Sparkles
} from "lucide-react";
import DashboardNav from "../components/DashboardNav";
import { resumeAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

// Helper to format bytes
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const Resume = () => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResume();
    }, []);

    // Auto-dismiss success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const fetchResume = async () => {
        try {
            const res = await resumeAPI.getMy();
            setResume(res.data.data);
        } catch (err) {
            console.error("Fetch resume error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFile = async (file) => {
        if (!file) return;
        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("File must be under 10 MB.");
            return;
        }

        setError("");
        setSuccess("");
        setUploading(true);
        try {
            const res = await resumeAPI.upload(file);
            setResume(res.data.data);
            setSuccess("Resume uploaded successfully!");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Upload failed. Try again.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = ""; // Reset input
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (!uploading && e.dataTransfer.files?.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await resumeAPI.delete();
            setResume(null);
            setSuccess("Resume removed.");
            setShowDeleteConfirm(false);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Delete failed.");
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <DashboardNav />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-400 font-medium">Loading your resume...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardNav />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                {/* ── Page Header ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Resume</h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base">
                        Keep your base resume updated here. We use it as the source of truth for AI generation.
                    </p>
                </motion.div>

                {/* ── Notifications ────────────────────────── */}
                <AnimatePresence mode="popLayout">
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 shadow-sm"
                        >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {success}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="mb-6 flex items-center justify-between gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 shadow-sm"
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                            <button onClick={() => setError("")} className="text-red-400 hover:text-red-700 font-medium">Clear</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Hidden File Input ────────────────────── */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <AnimatePresence mode="wait">
                    {/* ── NO RESUME STATE ────────────────────── */}
                    {!resume && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div
                                onClick={() => !uploading && inputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                className={`relative p-10 sm:p-14 text-center cursor-pointer transition-all duration-300
                                    ${dragOver
                                        ? "bg-blue-50/80"
                                        : "bg-white hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`absolute inset-4 rounded-2xl border-2 border-dashed transition-colors duration-300 pointer-events-none ${dragOver ? "border-blue-400" : "border-slate-200"}`} />

                                {uploading ? (
                                    <div className="flex flex-col items-center gap-5 relative z-10">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg">Parsing your PDF...</p>
                                            <p className="text-sm text-slate-500 mt-1">Extracting skills, experience, and projects</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-5 relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-sm
                                            ${dragOver ? "bg-blue-600 shadow-blue-200" : "bg-blue-50"}`}>
                                            <CloudUpload className={`w-7 h-7 transition-colors ${dragOver ? "text-white" : "text-blue-600"}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-xl sm:text-2xl mb-2">
                                                {dragOver ? "Drop it!" : "Upload your resume"}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Drag & drop your file here, or <span className="text-blue-600 font-semibold hover:underline">browse</span>
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                                                PDF only · Max 10MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── RESUME EXISTS STATE ────────────────── */}
                    {resume && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Main Resume Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner shrink-0 text-white font-bold text-xl uppercase border border-white/20">
                                        PDF
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-lg sm:text-xl truncate leading-tight mb-1">
                                            {resume.name}
                                        </p>
                                        <div className="flex items-center gap-3 text-blue-200 text-xs font-medium">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Parsed successfully
                                            </span>
                                            <span className="w-1 h-1 bg-blue-300 rounded-full" />
                                            <span>
                                                {/* If backend returns bytes, format it. If it returns string like '1.2MB' use it directly */}
                                                {typeof resume.size === 'number' ? formatBytes(resume.size) : resume.size || "Unknown size"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <p className="text-sm text-slate-500 mb-5 font-medium">
                                        Uploaded on {formatDate(resume.uploadedAt)}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href={resume.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            <Eye className="w-4 h-4 shrink-0" /> <span className="truncate">View File</span>
                                        </a>
                                        <button
                                            onClick={() => inputRef.current?.click()}
                                            disabled={uploading}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                                        >
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <RefreshCw className="w-4 h-4 shrink-0" />}
                                            <span className="truncate">{uploading ? "Replacing..." : "Replace"}</span>
                                        </button>
                                        <a
                                            href={resume.url}
                                            download={resume.name}
                                            className="w-11 h-11 flex items-center justify-center border border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shrink-0"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="w-11 h-11 flex items-center justify-center border border-red-100 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all shrink-0 sm:ml-auto"
                                            title="Delete permanently"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Re-parse nudge (More contextual flow) */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-sm">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Sparkles className="w-6 h-6 text-violet-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-900 mb-1">
                                        Update your portfolio?
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        If you've replaced your resume, you can let our AI re-read it to update your portfolio sections instantly without typing.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate("/onboarding")}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <FilePlus2 className="w-4 h-4" /> Re-build Portfolio
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── Delete Confirm Modal ─────────────────── */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm"
                        >
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <Trash2 className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Remove Resume?</h3>
                            <p className="text-sm text-center text-slate-500 mb-6 leading-relaxed">
                                This will permanently delete this resume file from your profile. It will not delete your current portfolio sections.
                            </p>
                            <div className="flex flex-col-reverse sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 shadow-sm"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Yes, Remove
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Resume;
