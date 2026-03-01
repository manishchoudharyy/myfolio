import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FileText, Trash2, RefreshCw, CheckCircle2,
    Loader2, AlertCircle, Download, Eye, FilePlus2, CloudUpload, History
} from "lucide-react";
import DashboardNav from "../components/DashboardNav";
import { resumeAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

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
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <DashboardNav />
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <DashboardNav />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Resume</h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Upload your resume — AI will parse it to build your portfolio instantly.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* ─── NO RESUME ─── */}
                    {!resume && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div
                                onClick={() => !uploading && inputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                                    ${dragOver
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40"
                                    }`}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Uploading to cloud...</p>
                                            <p className="text-sm text-slate-400 mt-0.5">Please wait</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors
                                            ${dragOver ? "bg-blue-100" : "bg-slate-100"}`}>
                                            <CloudUpload className={`w-8 h-8 transition-colors ${dragOver ? "text-blue-600" : "text-slate-400"}`} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-lg">
                                                {dragOver ? "Drop it here!" : "Upload your Resume"}
                                            </p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Drag & drop or <span className="text-blue-600 font-medium">browse</span> — PDF only, max 10 MB
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                                            {["AI parses automatically", "Secure cloud storage", "Replace anytime"].map((t) => (
                                                <span key={t} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">
                                                    ✓ {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                                </motion.div>
                            )}

                            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
                                onChange={(e) => handleFile(e.target.files[0])} />
                        </motion.div>
                    )}

                    {/* ─── RESUME EXISTS ─── */}
                    {resume && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {success && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
                                </motion.div>
                            )}

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                                </motion.div>
                            )}

                            {/* Resume card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <FileText className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate text-lg leading-snug">{resume.name}</p>
                                        <p className="text-blue-200 text-sm mt-0.5">PDF Document</p>
                                    </div>
                                    <span className="text-white/80 text-sm font-mono shrink-0">{resume.size}</span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Uploaded on {formatDate(resume.uploadedAt)}
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <a href={resume.url} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                            <Eye className="w-4 h-4" /> View
                                        </a>
                                        <a href={resume.url} download={resume.name}
                                            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                                            <Download className="w-4 h-4" /> Download
                                        </a>
                                        <button onClick={() => inputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                                            <RefreshCw className="w-4 h-4" /> Replace
                                        </button>
                                        <button onClick={() => setShowDeleteConfirm(true)}
                                            className="flex items-center gap-2 px-4 py-2.5 border border-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Re-parse nudge */}
                            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4 flex items-start gap-3">
                                <FilePlus2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-violet-900">Want to re-build portfolio from this resume?</p>
                                    <p className="text-xs text-violet-600 mt-0.5">AI will re-parse and update your content automatically.</p>
                                </div>
                                <button onClick={() => navigate("/onboarding")}
                                    className="shrink-0 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors">
                                    Re-parse
                                </button>
                            </div>

                            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
                                onChange={(e) => handleFile(e.target.files[0])} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-center text-slate-900 mb-1">Remove Resume?</h3>
                            <p className="text-sm text-center text-slate-500 mb-6">
                                Your resume will be removed from your active profile. The file will be kept in history.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={deleting}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60">
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {deleting ? "Removing..." : "Yes, Remove"}
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
