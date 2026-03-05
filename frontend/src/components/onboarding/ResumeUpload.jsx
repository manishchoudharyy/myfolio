import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { aiAPI } from "../../services/api";

const ResumeUpload = ({ onParsed }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | uploading | parsing | done | error
    const [error, setError] = useState("");
    const [progress, setProgress] = useState("");
    const inputRef = useRef();

    const handleFile = (f) => {
        if (f && f.type === "application/pdf") {
            setFile(f);
            setError("");
        } else {
            setError("Please select a PDF file");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        handleFile(f);
    };

    const handleUpload = async () => {
        if (!file) return;
        try {
            setStatus("uploading");
            setProgress("Uploading resume...");

            setTimeout(() => setProgress("Extracting text from PDF..."), 1000);
            setTimeout(() => setProgress("AI is analyzing your resume..."), 2500);

            const res = await aiAPI.resumeParse(file);

            setProgress("Parsing complete!");
            setStatus("done");

            setTimeout(() => {
                onParsed(res.data.data);
            }, 800);
        } catch (err) {
            setStatus("error");
            setError(err.response?.data?.error?.message || "Failed to parse resume. Please try again.");
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Upload your resume</h2>
                <p className="text-slate-500 font-medium text-sm">Upload a PDF and AI will extract all your details</p>
            </div>

            {/* Drop zone */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => status === "idle" && inputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${file
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                {status === "idle" && !file && (
                    <>
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">
                            Drag & drop your resume here
                        </p>
                        <p className="text-slate-400 text-sm">or click to browse • PDF only, max 5MB</p>
                    </>
                )}

                {file && status === "idle" && (
                    <>
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-slate-900 font-semibold mb-1">{file.name}</p>
                        <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(0)} KB</p>
                    </>
                )}

                {(status === "uploading" || status === "parsing") && (
                    <>
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Loader2 className="w-7 h-7 text-white animate-spin" />
                        </div>
                        <p className="text-slate-900 font-semibold mb-1">{progress}</p>
                        <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 overflow-hidden">
                            <motion.div
                                className="h-full bg-slate-900 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "90%" }}
                                transition={{ duration: 4 }}
                            />
                        </div>
                    </>
                )}

                {status === "done" && (
                    <>
                        <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-7 h-7 text-green-600" />
                        </div>
                        <p className="text-green-700 font-semibold">Resume parsed successfully!</p>
                    </>
                )}
            </motion.div>

            {/* Error */}
            {error && (
                <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Upload button */}
            {file && status === "idle" && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleUpload}
                    className="w-full mt-6 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-sm focus:ring-4 focus:ring-slate-200 hover:-translate-y-0.5"
                >
                    Upload Resume
                </motion.button>
            )}

            {status === "error" && (
                <button
                    onClick={() => { setStatus("idle"); setError(""); }}
                    className="w-full mt-4 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ResumeUpload;
