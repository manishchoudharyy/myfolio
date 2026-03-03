import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Sparkles, FileEdit, Layers, ExternalLink,
    Clock, Globe, AlertCircle, CheckCircle2,
    Palette, ArrowRight, Loader2, Wand2,
} from "lucide-react";
import DashboardNav from "../components/DashboardNav";
import { portfolioAPI } from "../services/api";

/* ─────────────────────────────────────────────────────────── */

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
            id: "ai",
            icon: Sparkles,
            accentIcon: Wand2,
            title: "Edit with AI",
            subtitle: "Describe a change, AI handles the rest. Preview updates live.",
            chips: ["Smart rewrites", "Live preview", "Conversational"],
            badge: "Popular",
            gradient: "from-violet-600 to-purple-700",
            softBg: "bg-violet-50",
            border: "border-violet-200 hover:border-violet-400",
            glow: "hover:shadow-violet-200",
            chipCls: "bg-violet-100 text-violet-700",
            cta: "text-violet-600",
            onClick: () => navigate("/onboarding"),
        },
        {
            id: "manual",
            icon: FileEdit,
            accentIcon: FileEdit,
            title: "Manual Edit",
            subtitle: "Edit every field directly. Auto-saves as you type.",
            chips: ["All sections", "Auto-save", "Full control"],
            badge: null,
            gradient: "from-blue-500 to-indigo-600",
            softBg: "bg-blue-50",
            border: "border-blue-200 hover:border-blue-400",
            glow: "hover:shadow-blue-200",
            chipCls: "bg-blue-100 text-blue-700",
            cta: "text-blue-600",
            onClick: () => portfolio && navigate(`/editor/${portfolio.id}`),
        },
        {
            id: "template",
            icon: Layers,
            accentIcon: Palette,
            title: "Change Template",
            subtitle: "Browse designs and switch. Your data stays, only look changes.",
            chips: ["All templates", "Instant switch", "Data safe"],
            badge: null,
            gradient: "from-emerald-500 to-teal-600",
            softBg: "bg-emerald-50",
            border: "border-emerald-200 hover:border-emerald-400",
            glow: "hover:shadow-emerald-200",
            chipCls: "bg-emerald-100 text-emerald-700",
            cta: "text-emerald-600",
            onClick: () => navigate("/onboarding?step=template"),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <DashboardNav />
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardNav portfolioUrl={portfolioUrl} />

            {/* Same max-w as DashboardNav */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {/* ── Row 1: Title + meta stats ─────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-start gap-6"
                >
                    {/* Left — Title */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Portfolio</h1>
                        <p className="text-slate-500 text-sm">Choose how you want to update your portfolio</p>

                        {/* No portfolio warning */}
                        {!portfolio && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                No portfolio yet.{" "}
                                <button onClick={() => navigate("/dashboard")} className="underline font-semibold">
                                    Create one
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right — Stats row (was bottom strip, now here) */}
                    {portfolio && (
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Status */}
                            <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${portfolio.status === "published"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                {portfolio.status === "published"
                                    ? <CheckCircle2 className="w-3.5 h-3.5" />
                                    : <AlertCircle className="w-3.5 h-3.5" />
                                }
                                {portfolio.status === "published" ? "Published" : "Draft"}
                            </div>

                            {/* Template */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600">
                                <Palette className="w-3.5 h-3.5 text-slate-400" />
                                {portfolio.templateSlug
                                    ? portfolio.templateSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
                                    : "No template"}
                            </div>

                            {/* Updated */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {portfolio.updatedAt
                                    ? new Date(portfolio.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                                    : "—"}
                            </div>

                            {/* Live link */}
                            {portfolioUrl && (
                                <a
                                    href={portfolioUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    {portfolio.subdomain}.myfolio.fun
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* ── Row 2: Option Cards ────────────────────────── */}
                <div className="grid sm:grid-cols-3 gap-5">
                    {EDIT_OPTIONS.map((opt, i) => {
                        const Icon = opt.icon;
                        return (
                            <motion.button
                                key={opt.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={opt.onClick}
                                disabled={!portfolio}
                                className={`group relative text-left bg-white rounded-2xl border-2 ${opt.border} p-6 transition-all duration-250 shadow-sm ${opt.glow} hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                {/* Badge */}
                                {opt.badge && (
                                    <span className={`absolute top-5 right-5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${opt.gradient} text-white shadow-sm`}>
                                        {opt.badge}
                                    </span>
                                )}

                                {/* Icon circle */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${opt.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-200`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Title + subtitle */}
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{opt.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-5">{opt.subtitle}</p>

                                {/* Chips */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {opt.chips.map((c) => (
                                        <span key={c} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${opt.chipCls}`}>
                                            {c}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA row */}
                                <div className={`flex items-center gap-1.5 text-sm font-bold ${opt.cta} group-hover:gap-2.5 transition-all`}>
                                    Get started
                                    <ArrowRight className="w-4 h-4" />
                                </div>

                                {/* Soft bg accent on hover */}
                                <div className={`absolute inset-0 rounded-2xl ${opt.softBg} opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none`} />
                            </motion.button>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default EditPortfolio;
