import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Eye, Edit3, Globe, Clock, ExternalLink, LogOut, Sparkles,
    LayoutTemplate, Plus, CheckCircle2, AlertCircle, Zap,
    Palette, Share2, ArrowRight, Rocket, Wand2, Monitor
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Dashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

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

    const handleLogout = () => {
        logout();
        navigate("/");
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
    const greeting = getGreeting();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="MyFolio" className="w-9 h-9 rounded-full shadow-sm" />
                        <div>
                            <h1 className="font-bold text-slate-900 text-base leading-tight">MyFolio</h1>
                            <p className="text-xs text-slate-400">Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{user?.name?.split(" ")[0]}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

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
                    // =================== EMPTY STATE — Redirect to Onboarding ===================
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-white overflow-hidden"
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
                            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
                        </div>
                        <div className="relative z-10 text-center max-w-lg mx-auto">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20"
                            >
                                <Rocket className="w-8 h-8 text-white" />
                            </motion.div>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Build Your Portfolio</h3>
                            <p className="text-blue-100 mb-8 text-sm sm:text-base leading-relaxed">
                                Upload your resume or chat with AI to create a stunning portfolio in minutes.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/onboarding")}
                                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-indigo-900/30 hover:shadow-2xl transition-all"
                            >
                                <Sparkles className="w-5 h-5" /> Start with AI
                            </motion.button>
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
                                value={portfolio.templateId || "—"}
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
        </div>
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
