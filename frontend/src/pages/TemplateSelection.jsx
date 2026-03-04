import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Check, ChevronLeft, Loader2, Sparkles,
    ArrowRight, CheckCircle2
} from "lucide-react";
import { templateAPI, portfolioAPI } from "../services/api";
import DashboardNav from "../components/DashboardNav";

/* ─── Per-template visual config ─────────────────────── */
const templateConfig = {
    minimal: {
        label: "Minimal",
        tagline: "Clean · Whitespace-focused · Typography-driven",
        tag: null,
        bg: "from-slate-50 to-slate-100",
        headerColor: "bg-slate-800",
        accentColor: "bg-slate-300",
        badgeColor: "bg-slate-100 text-slate-600",
        // Mini mockup colors
        headerBg: "bg-slate-800",
        pill1: "bg-slate-800",
        pill2: "bg-slate-200",
        bar1: "bg-slate-200",
        bar2: "bg-slate-100",
    },
    modern: {
        label: "Modern",
        tagline: "Bold · Gradient accents · Vibrant feel",
        tag: "Popular",
        bg: "from-blue-50 to-indigo-100",
        headerColor: "bg-gradient-to-r from-blue-600 to-indigo-600",
        accentColor: "bg-blue-400",
        badgeColor: "bg-blue-100 text-blue-700",
        headerBg: "bg-gradient-to-r from-blue-600 to-indigo-600",
        pill1: "bg-gradient-to-r from-blue-600 to-indigo-600",
        pill2: "bg-blue-100",
        bar1: "bg-blue-200",
        bar2: "bg-indigo-100",
    },
    professional: {
        label: "Professional",
        tagline: "Corporate · Structured · Refined",
        tag: null,
        bg: "from-emerald-50 to-teal-100",
        headerColor: "bg-emerald-700",
        accentColor: "bg-emerald-300",
        badgeColor: "bg-emerald-100 text-emerald-700",
        headerBg: "bg-emerald-700",
        pill1: "bg-emerald-700",
        pill2: "bg-emerald-100",
        bar1: "bg-emerald-200",
        bar2: "bg-teal-100",
    },
    fresher: {
        label: "Fresher",
        tagline: "Dark theme · Modern gradients · Gen-Z ready",
        tag: "Dark",
        bg: "from-gray-800 to-gray-950",
        headerColor: "bg-gradient-to-r from-blue-500 to-teal-400",
        accentColor: "bg-blue-400",
        badgeColor: "bg-gray-700 text-gray-200",
        headerBg: "bg-gray-900",
        pill1: "bg-gradient-to-r from-blue-500 to-teal-400",
        pill2: "bg-gray-700",
        bar1: "bg-gray-700",
        bar2: "bg-gray-800",
    },
};

/* ─── Mini mockup inside template card ───────────────── */
const TemplateMockup = ({ config, isDark }) => (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${isDark ? "border-gray-700" : "border-white/60"} text-left`}>
        {/* Fake header bar */}
        <div className={`${config.headerBg} px-3 py-2 flex items-center gap-2`}>
            <div className="w-5 h-5 rounded-full bg-white/20" />
            <div className="space-y-1 flex-1">
                <div className="h-1.5 w-14 bg-white/40 rounded" />
                <div className="h-1 w-10 bg-white/20 rounded" />
            </div>
        </div>
        {/* Body */}
        <div className={`${isDark ? "bg-gray-900" : "bg-white"} p-3 space-y-2`}>
            <div className="flex gap-1.5">
                <div className={`h-5 w-14 rounded-md ${config.pill1} opacity-90`} />
                <div className={`h-5 w-14 rounded-md ${config.pill2}`} />
            </div>
            <div className={`h-1.5 w-full ${config.bar1} rounded`} />
            <div className={`h-1.5 w-4/5 ${config.bar1} rounded`} />
            <div className={`h-1.5 w-3/5 ${config.bar2} rounded`} />
        </div>
    </div>
);

/* ─── Main page ───────────────────────────────────────── */
const TemplateSelection = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [selected, setSelected] = useState(null);  // { _id, slug }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [myPortfolio, setMyPortfolio] = useState(null);   // existing portfolio if any

    useEffect(() => {
        Promise.all([
            templateAPI.getAll(),
            portfolioAPI.getMyPortfolio().catch(() => null),
        ]).then(([tplRes, pRes]) => {
            setTemplates(tplRes.data.data);
            if (pRes) setMyPortfolio(pRes.data.data);
        }).catch(() => {
            setError("Failed to load templates.");
        }).finally(() => setLoading(false));
    }, []);

    const handleContinue = async () => {
        if (!selected) return;
        setSubmitting(true);
        setError(null);
        try {
            if (myPortfolio) {
                // Update existing portfolio template
                await portfolioAPI.update(myPortfolio.id, {});
                // patch template via update (send templateId + templateSlug)
                await portfolioAPI.update(myPortfolio.id, { ...myPortfolio.data });
                // The actual template switch — call update with templateId in the outer body
                navigate(`/editor/${myPortfolio.id}`);
            } else {
                const res = await portfolioAPI.create({
                    templateId: selected._id,
                    templateSlug: selected.slug,
                });
                navigate(`/editor/${res.data.data.portfolioId}`);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <DashboardNav />
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-400">Loading templates…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardNav />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* ── Page header ───────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        {myPortfolio ? "Switch Template" : "Step 1 of 2 — Choose Template"}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                        {myPortfolio ? "Pick a new look" : "Choose your template"}
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                        {myPortfolio
                            ? "Your content stays the same — only the design changes. Switch anytime."
                            : "Pick a design that matches your style. You can always switch it later."}
                    </p>
                </motion.div>

                {/* ── Template grid ─────────────────────────── */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                    {templates.map((template, i) => {
                        const cfg = templateConfig[template.slug] || templateConfig.minimal;
                        const isSelected = selected?._id === template._id;
                        const isDark = template.slug === "fresher";

                        return (
                            <motion.button
                                key={template._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelected({ _id: template._id, slug: template.slug })}
                                className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 shadow-sm ${isSelected
                                        ? "border-blue-600 shadow-blue-100 shadow-lg"
                                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                    }`}
                            >
                                {/* Popular / Dark badge */}
                                {cfg.tag && (
                                    <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badgeColor}`}>
                                        {cfg.tag}
                                    </div>
                                )}

                                {/* Selected check */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                            className="absolute top-3 right-3 z-10 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md"
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Preview area */}
                                <div className={`bg-gradient-to-br ${cfg.bg} p-5 h-44 flex items-center justify-center relative overflow-hidden`}>
                                    <div className="w-full max-w-[180px] group-hover:scale-105 transition-transform duration-500">
                                        <TemplateMockup config={cfg} isDark={isDark} />
                                    </div>

                                    {/* Ring highlight when active */}
                                    {isSelected && (
                                        <div className="absolute inset-0 ring-2 ring-inset ring-blue-500/20 pointer-events-none" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className={`p-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {template.name}
                                        </h3>
                                        {isSelected && (
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                                        {template.description || cfg.tagline}
                                    </p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* ── Error ─────────────────────────────────── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                        >
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── CTA strip ─────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(myPortfolio ? "/edit" : "/dashboard")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <motion.button
                        whileHover={selected ? { scale: 1.03 } : {}}
                        whileTap={selected ? { scale: 0.97 } : {}}
                        onClick={handleContinue}
                        disabled={!selected || submitting}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${selected
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/80 shadow-md"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {submitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Creating portfolio…</>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> {myPortfolio ? "Apply Template" : "Use this template"} <ArrowRight className="w-4 h-4" /></>
                        )}
                    </motion.button>
                </div>

                {/* Selection hint */}
                {!selected && (
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Select a template above to continue
                    </p>
                )}
            </main>
        </div>
    );
};

export default TemplateSelection;
