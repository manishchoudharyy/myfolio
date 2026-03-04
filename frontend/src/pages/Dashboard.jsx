import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Eye, Edit3, Globe, Clock, ExternalLink, Sparkles,
    LayoutTemplate, Rocket, FileText,
    CheckCircle2, AlertCircle
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardNav from "../components/DashboardNav";

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

const StatCard = ({ icon, label, value, bg, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
            {icon}
        </div>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-none mb-1">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
    </motion.div>
);

const Dashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            const res = await dashboardAPI.get();
            setDashData(res.data.data);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 font-medium">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    const portfolio = dashData?.portfolio;
    const portfolioUrl = portfolio?.status === "published" && portfolio?.subdomain
        ? `https://${portfolio.subdomain}.myfolio.fun`
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardNav portfolioUrl={portfolioUrl} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-7"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {getGreeting()}, {user?.name?.split(" ")[0] || "there"} 👋
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base mt-1">
                        {portfolio
                            ? "Here's an overview of your portfolio"
                            : "Let's build your professional portfolio today"}
                    </p>
                </motion.div>

                {!portfolio ? (
                    /* ══════════════════════════════════════
                       EMPTY STATE
                    ══════════════════════════════════════ */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 rounded-3xl shadow-sm p-7 sm:p-12"
                    >
                        <div className="text-center max-w-xl mx-auto mb-8">
                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI-Powered Portfolio Builder
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-snug">
                                Create your portfolio{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    in minutes
                                </span>
                            </h2>
                            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                                Choose how you'd like to build — upload your existing resume or let our AI guide you step by step.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">

                            {/* Upload Resume */}
                            <motion.button
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/onboarding?method=resume")}
                                className="group relative text-left bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50 group-hover:to-indigo-50/50 transition-all duration-300 rounded-2xl" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200">
                                        <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1.5">Upload Resume</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        Have a resume ready? Upload your PDF and AI extracts everything instantly.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["PDF only", "Auto-parsed", "~10 sec"].map((t) => (
                                            <span key={t} className="text-xs bg-white text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute bottom-5 right-5 w-7 h-7 bg-white group-hover:bg-blue-600 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-blue-600 transition-all shadow-sm">
                                    <Rocket className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                            </motion.button>

                            {/* Chat with AI */}
                            <motion.button
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/onboarding?method=chat")}
                                className="group relative text-left bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-violet-200 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-violet-50/0 group-hover:from-violet-50 group-hover:to-purple-50/50 transition-all duration-300 rounded-2xl" />
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                    POPULAR
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-violet-100 group-hover:bg-violet-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200">
                                        <Sparkles className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors duration-200" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1.5">Chat with AI</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        No resume? No problem. Answer a few questions and AI builds your portfolio.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["Conversational", "Step-by-step", "No resume"].map((t) => (
                                            <span key={t} className="text-xs bg-white text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute bottom-5 right-5 w-7 h-7 bg-white group-hover:bg-violet-600 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-violet-600 transition-all shadow-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                            </motion.button>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-6 border-t border-slate-100">
                            {[
                                { n: "1", label: "Choose method" },
                                { n: "2", label: "AI builds portfolio" },
                                { n: "3", label: "Pick template & publish" },
                            ].map((s, i) => (
                                <React.Fragment key={s.n}>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                            {s.n}
                                        </div>
                                        <span className="hidden sm:inline text-slate-500 font-medium">{s.label}</span>
                                    </div>
                                    {i < 2 && <div className="w-5 sm:w-10 h-px bg-slate-200 flex-shrink-0" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>

                ) : (
                    /* ══════════════════════════════════════
                       PORTFOLIO EXISTS STATE
                    ══════════════════════════════════════ */
                    <div className="space-y-5">

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <StatCard icon={<Eye className="w-5 h-5 text-blue-600" />} label="Total Views" bg="bg-blue-50" value={portfolio.views ?? 0} delay={0.05} />
                            <StatCard icon={<Globe className="w-5 h-5 text-emerald-600" />} label="Status" bg="bg-emerald-50" value={portfolio.status === "published" ? "Live" : "Draft"} delay={0.1} />
                            <StatCard icon={<LayoutTemplate className="w-5 h-5 text-violet-600" />} label="Template" bg="bg-violet-50" value={portfolio.templateSlug || "—"} delay={0.15} />
                            <StatCard icon={<Clock className="w-5 h-5 text-orange-500" />} label="Last Updated" bg="bg-orange-50" value={portfolio.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"} delay={0.2} />
                        </div>

                        {/* Portfolio Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                        >
                            {/* Gradient header */}
                            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 px-5 sm:px-6 py-5">
                                {/* Status badge */}
                                <div className="absolute top-4 right-4">
                                    {portfolio.status === "published" ? (
                                        <span className="inline-flex items-center gap-1.5 bg-green-400/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Live
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                                            <AlertCircle className="w-3 h-3" /> Draft
                                        </span>
                                    )}
                                </div>

                                {/* Avatar + info */}
                                <div className="flex items-center gap-4">
                                    {portfolio.data?.avatar ? (
                                        <img src={portfolio.data.avatar} alt={portfolio.data.name} className="w-14 h-14 rounded-2xl border-2 border-white/30 object-cover shadow-md shrink-0" />
                                    ) : (
                                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl border border-white/20 shadow-md shrink-0">
                                            {portfolio.data?.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="text-base sm:text-lg font-bold text-white truncate">
                                            {portfolio.data?.name || "Your Name"}
                                        </h2>
                                        <p className="text-blue-200 text-sm truncate">
                                            {portfolio.data?.title || "Your Title"}
                                        </p>
                                        {portfolio.subdomain && (
                                            <p className="text-blue-300 text-xs mt-0.5 font-mono truncate">
                                                {portfolio.subdomain}.myfolio.fun
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Decorative orb */}
                                <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            </div>

                            {/* Actions row */}
                            <div className="px-5 py-4 flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={() => navigate("/edit")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Portfolio
                                </button>

                                {portfolioUrl && (
                                    <a
                                        href={portfolioUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        View Live <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
