import React, { useState } from "react";
import { motion } from "motion/react";
import { Globe, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { portfolioAPI } from "../../services/api";

const PublishStep = ({ portfolioId, onPublished, onBack }) => {
    const [subdomain, setSubdomain] = useState("");
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null); // null | true | false
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState("");
    const [error, setError] = useState("");

    const handleCheck = async () => {
        if (!subdomain.trim()) return;
        setChecking(true);
        setAvailable(null);
        setError("");

        try {
            const res = await portfolioAPI.checkSubdomain(subdomain.toLowerCase());
            setAvailable(res.data.data.available);
        } catch (err) {
            setError("Failed to check availability");
        } finally {
            setChecking(false);
        }
    };

    const handlePublish = async () => {
        if (!available) return;
        setPublishing(true);
        setError("");

        try {
            const res = await portfolioAPI.publish(portfolioId, subdomain.toLowerCase());
            setPublishedUrl(res.data.data.url);
            setPublished(true);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to publish");
        } finally {
            setPublishing(false);
        }
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(publishedUrl);
    };

    if (published) {
        return (
            <div className="max-w-lg mx-auto px-4 py-20 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                </motion.div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">You're live! 🎉</h2>
                <p className="text-slate-500 mb-8">Your portfolio is now published and accessible to the world.</p>

                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between mb-6 border border-slate-200">
                    <span className="text-blue-600 font-medium text-sm truncate">{publishedUrl}</span>
                    <div className="flex gap-2 shrink-0 ml-3">
                        <button
                            onClick={copyUrl}
                            className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                            title="Copy URL"
                        >
                            <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                        <a
                            href={publishedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <button
                    onClick={onPublished}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-16">
            <button onClick={onBack} className="flex items-center gap-1 text-slate-500 text-sm mb-8 hover:text-slate-700 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to preview
            </button>

            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose your URL</h2>
                <p className="text-slate-500 text-sm">Pick a unique subdomain for your portfolio</p>
            </div>

            {/* Subdomain input */}
            <div className="bg-white rounded-xl border border-slate-200 p-1 flex items-center mb-3">
                <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => {
                        setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        setAvailable(null);
                    }}
                    placeholder="your-name"
                    className="flex-1 px-4 py-3 text-sm focus:outline-none"
                />
                <span className="text-slate-400 text-sm pr-2">.myfolio.fun</span>
                <button
                    onClick={handleCheck}
                    disabled={!subdomain.trim() || subdomain.length < 3 || checking}
                    className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                >
                    {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
                </button>
            </div>

            {/* Availability status */}
            {available === true && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm flex items-center gap-1 mb-4"
                >
                    <CheckCircle2 className="w-4 h-4" /> {subdomain}.myfolio.fun is available!
                </motion.p>
            )}
            {available === false && (
                <p className="text-red-500 text-sm flex items-center gap-1 mb-4">
                    <AlertCircle className="w-4 h-4" /> Already taken. Try another one.
                </p>
            )}
            {error && (
                <p className="text-red-500 text-sm flex items-center gap-1 mb-4">
                    <AlertCircle className="w-4 h-4" /> {error}
                </p>
            )}

            <p className="text-xs text-slate-400 mb-6">
                3-30 characters, only lowercase letters, numbers, and hyphens.
            </p>

            {/* Publish button */}
            <button
                onClick={handlePublish}
                disabled={!available || publishing}
                className={`w-full px-6 py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${available
                        ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
            >
                {publishing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                    </>
                ) : (
                    <>
                        <Globe className="w-4 h-4" /> Publish Portfolio
                    </>
                )}
            </button>
        </div>
    );
};

export default PublishStep;
