import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Sparkles, FileEdit, Layers, ExternalLink,
    Clock, Globe, AlertCircle, CheckCircle2,
    Palette, ArrowRight, Loader2, Wand2, Rocket,
    Eye
} from "lucide-react";
import DashboardNav from "../components/DashboardNav";
import { portfolioAPI } from "../services/api";

const EditPortfolio = () => {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        portfolioAPI.getMyPortfolio()
            .then((res) => setPortfolio(res.data.data))
            .catch(() => setPortfolio(null))
            .finally(() => setLoading(false));
    }, []);

    const portfolioUrl = portfolio?.subdomain
        ? `https://${portfolio.subdomain}.myfolio.fun`
        : null;

    const EDIT_OPTIONS = [
        {
            id: "manual",
            icon: FileEdit,
            title: "Manual Edit",
            subtitle: "Edit every field directly — name, bio, skills, projects, experience. Changes auto-save.",
            chips: ["All sections", "Auto-save", "Full control"],
            badge: null,
            gradient: "from-blue-500 to-indigo-600",
            border: "border-blue-100 hover:border-blue-300",
            glow: "hover:shadow-blue-100",
            chipCls: "bg-blue-50 text-blue-700",
            cta: "text-blue-600",
            onClick: () => portfolio && navigate(`/editor/${portfolio.id}`),
        },
        {
            id: "ai",
            icon: Sparkles,
            title: "Edit with AI",
            subtitle: "Describe a change in plain English — AI rewrites, refines, and updates your portfolio instantly.",
            chips: ["Smart rewrites", "Conversational", "Live preview"],
            badge: "Popular",
            gradient: "from-violet-600 to-purple-700",
            border: "border-violet-100 hover:border-violet-300",
            glow: "hover:shadow-violet-100",
            chipCls: "bg-violet-50 text-violet-700",
            cta: "text-violet-600",
            onClick: () => navigate("/onboarding"),
        },
        {
            id: "template",
            icon: Layers,
            title: "Change Template",
            subtitle: "Browse all designs and switch with one click. Your data stays safe — only the look changes.",
            chips: ["Live preview", "Instant switch", "Data safe"],
            badge: null,
            gradient: "from-emerald-500 to-teal-600",
            border: "border-emerald-100 hover:border-emerald-300",
            glow: "hover:shadow-emerald-100",
            chipCls: "bg-emerald-50 text-emerald-700",
            cta: "text-emerald-600",
            onClick: () => navigate("/templates"),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <DashboardNav />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-400">Loading portfolio…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardNav portfolioUrl={portfolioUrl} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">

                {/* ── Page header ───────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Edit Portfolio</h1>
                    <p className="text-slate-500 text-sm mt-1">Choose how you want to update your portfolio</p>
                </motion.div>

                {/* ── No portfolio state ────────────────────────── */}
                {!portfolio ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-amber-200 rounded-2xl p-8 text-center shadow-sm"
                    >
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-amber-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">No portfolio yet</h2>
                        <p className="text-slate-500 text-sm mb-5">Create your portfolio first to start editing.</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            <Rocket className="w-4 h-4" /> Create Portfolio
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* ── Portfolio snapshot card ───────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 sm:px-6 py-4">

                                {/* Avatar + info */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {portfolio.data?.avatar ? (
                                        <img src={portfolio.data.avatar} alt={portfolio.data.name} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                                    ) : (
                                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                                            {portfolio.data?.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-sm truncate">{portfolio.data?.name || "Your portfolio"}</p>
                                        <p className="text-xs text-slate-400 truncate">{portfolio.data?.title || "No title set"}</p>
                                    </div>
                                </div>

                                {/* Meta pills */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Status */}
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${portfolio.status === "published"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"}`}
                                    >
                                        {portfolio.status === "published"
                                            ? <><CheckCircle2 className="w-3 h-3" /> Published</>
                                            : <><AlertCircle className="w-3 h-3" /> Draft</>}
                                    </span>

                                    {/* Template */}
                                    {portfolio.templateSlug && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                            <Palette className="w-3 h-3" />
                                            {portfolio.templateSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                        </span>
                                    )}

                                    {/* Views */}
                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                        <Eye className="w-3 h-3" /> {portfolio.views ?? 0} views
                                    </span>

                                    {/* Live link */}
                                    {portfolioUrl && (
                                        <a href={portfolioUrl} target="_blank" rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                        >
                                            <Globe className="w-3 h-3" /> View Live <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Publish banner (only if draft) ────────── */}
                        {portfolio.status !== "published" && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 }}
                                className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Rocket className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-900">Your portfolio is not live yet</p>
                                        <p className="text-xs text-amber-700 mt-0.5">Complete editing and publish it to get your personal URL.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/editor/${portfolio.id}`)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                                >
                                    Publish now <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        )}

                        {/* ── Edit option cards ─────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {EDIT_OPTIONS.map((opt, i) => {
                                const Icon = opt.icon;
                                return (
                                    <motion.button
                                        key={opt.id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.08 }}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={opt.onClick}
                                        className={`group relative text-left bg-white rounded-2xl border-2 ${opt.border} p-5 sm:p-6 transition-all duration-200 shadow-sm ${opt.glow} hover:shadow-xl`}
                                    >
                                        {/* Popular badge */}
                                        {opt.badge && (
                                            <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${opt.gradient} text-white shadow-sm`}>
                                                {opt.badge}
                                            </span>
                                        )}

                                        {/* Icon */}
                                        <div className={`w-11 h-11 bg-gradient-to-br ${opt.gradient} rounded-xl flex items-center justify-center mb-4 shadow group-hover:scale-105 transition-transform duration-200`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Title + subtitle */}
                                        <h3 className="font-bold text-slate-900 text-base mb-1">{opt.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-4">{opt.subtitle}</p>

                                        {/* Chips */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {opt.chips.map((c) => (
                                                <span key={c} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${opt.chipCls}`}>
                                                    {c}
                                                </span>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <div className={`flex items-center gap-1.5 text-sm font-bold ${opt.cta} group-hover:gap-3 transition-all`}>
                                            Get started <ArrowRight className="w-4 h-4" />
                                        </div>

                                        {/* Subtle hover bg */}
                                        <div className="absolute inset-0 rounded-2xl bg-current opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
                                    </motion.button>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default EditPortfolio;
