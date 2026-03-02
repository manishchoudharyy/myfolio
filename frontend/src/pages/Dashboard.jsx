import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Eye, Edit3, Globe, Clock, ExternalLink, Sparkles,
    LayoutTemplate, CheckCircle2, AlertCircle, Rocket
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardNav from "../components/DashboardNav";

const Dashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await dashboardAPI.get();
            setDashData(res.data.data);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const portfolio = dashData?.portfolio;
    const portfolioUrl = portfolio?.status === "published" && portfolio?.subdomain
        ? `https://${portfolio.subdomain}.myfolio.fun`
        : null;
    const greeting = getGreeting();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <DashboardNav portfolioUrl={portfolioUrl} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {portfolio
                            ? "Here's an overview of your portfolio"
                            : "Let's build your professional portfolio today"}
                    </p>
                </motion.div>

                {!portfolio ? (
                    // =================== EMPTY STATE ===================
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sm:p-12 space-y-8"
                    >
                        {/* Hero text */}
                        <div className="text-center max-w-xl mx-auto pt-2">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", delay: 0.15 }}
                                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                AI-Powered Portfolio Builder
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                Create your portfolio <br />
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    in minutes
                                </span>
                            </h2>
                            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                                Choose how you'd like to build — upload your existing resume or let our AI guide you step by step.
                            </p>
                        </div>

                        {/* Two option cards */}
                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">

                            {/* Option 1 — Upload Resume */}
                            <motion.button
                                whileHover={{ y: -3, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/onboarding?method=resume")}
                                className="group relative text-left bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/80 group-hover:to-indigo-50/60 transition-all duration-300 rounded-2xl" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200">
                                        <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1.5">Upload Resume</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        Have a resume ready? Upload your PDF and AI will extract all your details instantly.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["PDF only", "Auto-parsed by AI", "~10 seconds"].map((t) => (
                                            <span key={t} className="text-xs bg-white group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-700 px-2.5 py-0.5 rounded-full border border-slate-200 group-hover:border-blue-200 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute bottom-5 right-5 w-7 h-7 bg-white group-hover:bg-blue-600 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-blue-600 transition-colors duration-200 shadow-sm">
                                    <Rocket className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-200" />
                                </div>
                            </motion.button>

                            {/* Option 2 — Chat with AI */}
                            <motion.button
                                whileHover={{ y: -3, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/onboarding?method=chat")}
                                className="group relative text-left bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-violet-300 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-purple-50/0 group-hover:from-violet-50/80 group-hover:to-purple-50/60 transition-all duration-300 rounded-2xl" />

                                <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                    POPULAR
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-violet-100 group-hover:bg-violet-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200">
                                        <Sparkles className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors duration-200" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1.5">Chat with AI</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        No resume? No problem. Answer a few questions and AI builds your portfolio.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["Conversational", "Step-by-step", "No resume needed"].map((t) => (
                                            <span key={t} className="text-xs bg-white group-hover:bg-violet-100 text-slate-500 group-hover:text-violet-700 px-2.5 py-0.5 rounded-full border border-slate-200 group-hover:border-violet-200 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute bottom-5 right-5 w-7 h-7 bg-white group-hover:bg-violet-600 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-violet-600 transition-colors duration-200 shadow-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-200" />
                                </div>
                            </motion.button>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 pt-2 border-t border-slate-100">
                            {[
                                { n: "1", label: "Choose method" },
                                { n: "2", label: "AI builds portfolio" },
                                { n: "3", label: "Pick template & publish" },
                            ].map((s, i) => (
                                <React.Fragment key={s.n}>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {s.n}
                                        </div>
                                        <span className="hidden sm:inline">{s.label}</span>
                                    </div>
                                    {i < 2 && <div className="w-6 h-px bg-slate-200" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    // =================== PORTFOLIO EXISTS ===================
                    <div>
                        {/* Status Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${portfolio.status === "published"
                                ? "bg-green-50 border border-green-200"
                                : "bg-amber-50 border border-amber-200"
                                }`}
                        >
                            {portfolio.status === "published" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className={`font-medium text-sm ${portfolio.status === "published" ? "text-green-800" : "text-amber-800"
                                    }`}>
                                    {portfolio.status === "published"
                                        ? `Your portfolio is live at ${portfolio.subdomain}.myfolio.fun`
                                        : "Your portfolio is in draft mode. Publish it to go live!"}
                                </p>
                            </div>
                            {portfolio.status === "published" && portfolio.subdomain && (
                                <a
                                    href={`https://${portfolio.subdomain}.myfolio.fun`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-sm text-green-700 font-medium hover:text-green-800"
                                >
                                    Visit <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </motion.div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <StatCard
                                icon={<Eye className="w-5 h-5 text-blue-600" />}
                                label="Total Views"
                                value={portfolio.views || 0}
                                bg="bg-blue-50"
                            />
                            <StatCard
                                icon={<Globe className="w-5 h-5 text-green-600" />}
                                label="Status"
                                value={portfolio.status === "published" ? "Live" : "Draft"}
                                bg="bg-green-50"
                            />
                            <StatCard
                                icon={<LayoutTemplate className="w-5 h-5 text-purple-600" />}
                                label="Template"
                                value={portfolio.templateSlug || "—"}
                                bg="bg-purple-50"
                            />
                            <StatCard
                                icon={<Clock className="w-5 h-5 text-orange-600" />}
                                label="Last Updated"
                                value={portfolio.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString() : "—"}
                                bg="bg-orange-50"
                            />
                        </div>

                        {/* Portfolio Preview Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    {portfolio.data?.avatar ? (
                                        <img
                                            src={portfolio.data.avatar}
                                            alt={portfolio.data.name}
                                            className="w-14 h-14 rounded-full border-2 border-white/30"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {portfolio.data?.name?.charAt(0) || "?"}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-bold">{portfolio.data?.name || "Your Name"}</h2>
                                        <p className="text-slate-400 text-sm">{portfolio.data?.title || "Your Title"}</p>
                                    </div>
                                </div>
                                {portfolio.data?.about && (
                                    <p className="text-slate-300 text-sm mt-3 line-clamp-2">{portfolio.data.about}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                                <QuickStat label="Skills" count={portfolio.data?.skills?.length || 0} />
                                <QuickStat label="Projects" count={portfolio.data?.projects?.length || 0} />
                                <QuickStat label="Experience" count={portfolio.data?.experience?.length || 0} />
                            </div>

                            <div className="p-4 flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/onboarding")}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Sparkles className="w-4 h-4" /> Edit with AI
                                </button>
                                <button
                                    onClick={() => navigate(`/editor/${portfolio.id}`)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" /> Manual Edit
                                </button>
                                <button
                                    onClick={() => navigate("/templates")}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <LayoutTemplate className="w-4 h-4" /> Change Template
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div >
    );
};

// =================== HELPER COMPONENTS ===================

const StatCard = ({ icon, label, value, bg }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
            {icon}
        </div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </motion.div>
);

const QuickStat = ({ label, count }) => (
    <div className="py-3 text-center">
        <p className="text-lg font-bold text-slate-900">{count}</p>
        <p className="text-xs text-slate-500">{label}</p>
    </div>
);

// Greeting based on time
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

export default Dashboard;
