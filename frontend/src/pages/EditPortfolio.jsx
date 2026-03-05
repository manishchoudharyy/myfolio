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
            subtitle: "Edit every field directly — name, bio, skills, projects, experience. Changes are saved manually.",
            chips: ["All sections", "Manual save", "Full control"],
            badge: null,
            iconBg: "bg-slate-50 border border-slate-200 text-slate-700",
            chipCls: "bg-slate-50 text-slate-600 border border-slate-100",
            cta: "text-slate-900 group-hover:text-slate-600",
            onClick: () => portfolio && navigate(`/editor/${portfolio.id}`),
        },
        {
            id: "ai",
            icon: Sparkles,
            title: "Edit with AI",
            subtitle: "Describe a change in plain English — AI rewrites, refines, and updates your portfolio instantly.",
            chips: ["Smart rewrites", "Conversational", "Live preview"],
            badge: "Popular",
            iconBg: "bg-slate-900 text-white",
            chipCls: "bg-slate-100 text-slate-700 font-bold",
            cta: "text-slate-900 group-hover:text-slate-600",
            onClick: () => navigate("/onboarding"),
        },
        {
            id: "template",
            icon: Layers,
            title: "Change Template",
            subtitle: "Browse all designs and switch with one click. Your data stays safe — only the look changes.",
            chips: ["Live preview", "Instant switch", "Data safe"],
            badge: null,
            iconBg: "bg-slate-50 border border-slate-200 text-slate-700",
            chipCls: "bg-slate-50 text-slate-600 border border-slate-100",
            cta: "text-slate-900 group-hover:text-slate-600",
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
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Edit Portfolio</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Choose how you want to update your portfolio.</p>
                </motion.div>

                {/* ── No portfolio state ────────────────────────── */}
                {!portfolio ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm"
                    >
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">No portfolio yet</h2>
                        <p className="text-slate-500 text-sm mb-6 font-medium">Create your portfolio first to start editing.</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-slate-200"
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
                            className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5 px-6 sm:px-8 py-5">

                                {/* Avatar + info */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {portfolio.data?.avatar ? (
                                        <img src={portfolio.data.avatar} alt={portfolio.data.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                                            {portfolio.data?.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-base truncate tracking-tight">{portfolio.data?.name || "Your portfolio"}</p>
                                        <p className="text-sm font-medium text-slate-500 truncate">{portfolio.data?.title || "No title set"}</p>
                                    </div>
                                </div>

                                {/* Meta pills */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Status */}
                                    <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg border ${portfolio.status === "published"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"}`}
                                    >
                                        {portfolio.status === "published"
                                            ? <><CheckCircle2 className="w-3.5 h-3.5" /> Published</>
                                            : <><AlertCircle className="w-3.5 h-3.5" /> Draft</>}
                                    </span>

                                    {/* Template */}
                                    {portfolio.templateSlug && (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                                            <Palette className="w-3.5 h-3.5" />
                                            {portfolio.templateSlug.replace(/-/g, " ")}
                                        </span>
                                    )}

                                    {/* Views */}
                                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                                        <Eye className="w-3.5 h-3.5" /> {portfolio.views ?? 0}
                                    </span>

                                    {/* Live link */}
                                    {portfolioUrl && (
                                        <a href={portfolioUrl} target="_blank" rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 transition-colors shadow-sm"
                                        >
                                            <Globe className="w-3.5 h-3.5" /> View Live <ExternalLink className="w-3 h-3 ml-0.5" />
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
                                className="bg-amber-50 border border-amber-200 rounded-3xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Rocket className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-900">Your portfolio is not live yet</p>
                                        <p className="text-xs font-medium text-amber-800 mt-0.5">Complete editing and publish it to get your personal URL.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/editor/${portfolio.id}`)}
                                    className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-amber-100 shrink-0"
                                >
                                    Publish now <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* ── Edit option cards ─────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                                        className="group relative text-left bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 transition-all duration-200 shadow-sm hover:border-slate-400 hover:ring-4 hover:ring-slate-100 overflow-hidden cursor-pointer"
                                    >
                                        {/* Popular badge */}
                                        {opt.badge && (
                                            <span className="absolute top-5 right-5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase tracking-wider shadow-sm">
                                                {opt.badge}
                                            </span>
                                        )}

                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${opt.iconBg} transition-transform duration-200`}>
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        {/* Title + subtitle */}
                                        <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{opt.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{opt.subtitle}</p>

                                        {/* Chips */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {opt.chips.map((c) => (
                                                <span key={c} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${opt.chipCls}`}>
                                                    {c}
                                                </span>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <div className={`flex items-center gap-1.5 text-sm font-bold ${opt.cta} group-hover:gap-2 transition-all`}>
                                            Get started <ArrowRight className="w-4 h-4" />
                                        </div>
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
