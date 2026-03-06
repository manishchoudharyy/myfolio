import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Eye, Edit3, Globe, Clock, ExternalLink, Sparkles,
    LayoutTemplate, FileText, CheckCircle2, AlertCircle,
    Copy, Share2, ChartNoAxesColumn, UserPlus, Code2, ArrowRight, Rocket, Monitor, Smartphone, Tablet
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

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const StatCard = ({ icon, title, value, trend }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                {icon}
            </div>
            {trend && (
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                    {trend}
                </span>
            )}
        </div>
        <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-500">{title}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

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

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const portfolio = dashData?.portfolio;
    const portfolioUrl = portfolio?.status === "published" && portfolio?.subdomain
        ? `https://${portfolio.subdomain}.myfolio.fun`
        : null;

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <DashboardNav portfolioUrl={portfolioUrl} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 overflow-hidden">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 mt-1">
                            {portfolio
                                ? "Here is what's happening with your portfolio."
                                : "Let's get started on building your professional identity."}
                        </p>
                    </div>
                    {portfolio && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/editor/${portfolio.id}`)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-sm shrink-0"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Portfolio
                        </motion.button>
                    )}
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {!portfolio ? (
                        /* ── Empty State ── */
                        <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center py-10 sm:py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 rounded-[32px] mb-8 shadow-inner border border-white/50">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-5 tracking-tight leading-tight">
                                Your portfolio journey <br className="hidden sm:block" /> starts here.
                            </h2>
                            <p className="text-base sm:text-lg text-slate-500 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                                Build a stunning professional identity in minutes. Choose how you want to get started. No coding required.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                                <motion.button
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/onboarding?method=resume")}
                                    className="group relative bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all transition-duration-300"
                                >
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">Upload Resume</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Fastest way. Upload your PDF and let our AI extract your timeline, skills, and projects instantly.
                                    </p>

                                    <div className="absolute top-6 right-6 text-slate-200 group-hover:text-blue-500 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/onboarding?method=chat")}
                                    className="group relative bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10 transition-all transition-duration-300 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 bg-violet-500 text-white text-[10px] font-black uppercase tracking-wider py-1.5 px-4 rounded-bl-2xl">Popular</div>
                                    <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">Chat with AI</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Don't have a resume? Have a quick 2-minute chat with our AI to build your professional profile.
                                    </p>

                                    <div className="absolute top-6 right-6 text-slate-200 group-hover:text-violet-500 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        /* ── Portfolio Exists ── */
                        <div className="space-y-4 sm:space-y-6">

                            {/* Top Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <StatCard
                                    icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    title="Total Views"
                                    value={dashData?.analytics?.totalViews ?? portfolio.views ?? 0}
                                    trend={dashData?.analytics?.recentViews > 0 ? `+${dashData.analytics.recentViews} recently` : null}
                                />
                                <StatCard
                                    icon={<ChartNoAxesColumn className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    title="Status"
                                    value={portfolio.status === "published" ? "Live" : "Draft"}
                                />
                                <StatCard
                                    icon={<LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    title="Theme Used"
                                    value={<span className="capitalize text-lg sm:text-2xl">{portfolio.templateSlug || "Minimal"}</span>}
                                />
                                <StatCard
                                    icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    title="Last Updated"
                                    value={portfolio.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "Today"}
                                />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

                                {/* Main Identity Card */}
                                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                                        {/* Avatar */}
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotate: -2 }}
                                            className="shrink-0 relative cursor-pointer"
                                        >
                                            {portfolio.data?.avatar ? (
                                                <img src={portfolio.data.avatar} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-slate-50 shadow-sm" />
                                            ) : (
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold ring-4 ring-slate-50 shadow-sm">
                                                    {portfolio.data?.name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                        </motion.div>

                                        {/* Info */}
                                        <div className="flex-1 w-full">
                                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{portfolio.data?.name || "Your Name"}</h2>
                                            <p className="text-sm sm:text-base text-slate-500 font-medium">{portfolio.data?.title || "Your Title"}</p>

                                            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                                                {portfolioUrl ? (
                                                    <motion.a
                                                        whileHover={{ scale: 1.02 }}
                                                        href={portfolioUrl} target="_blank" rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg max-w-full truncate transition-colors"
                                                    >
                                                        <Globe className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">{portfolio.subdomain}.myfolio.fun</span>
                                                    </motion.a>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/50">
                                                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Not published
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-slate-100 my-4 sm:my-5" />

                                    {/* Quick Actions */}
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4 uppercase tracking-wide">Quick Actions</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                            {[
                                                { label: "Edit Skills", icon: Code2, path: `/editor/${portfolio.id}#skills`, color: "blue" },
                                                { label: "Add Project", icon: FileText, path: `/editor/${portfolio.id}#projects`, color: "violet" },
                                                { label: "Update Bio", icon: UserPlus, path: `/editor/${portfolio.id}#about`, color: "emerald" },
                                                { label: "Templates", icon: LayoutTemplate, path: "/templates", color: "orange" }
                                            ].map((action, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    whileHover={{ y: -3, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => navigate(action.path)}
                                                    className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-${action.color}-400 hover:bg-${action.color}-50 transition-colors group shadow-sm hover:shadow`}
                                                >
                                                    <action.icon className={`w-5 h-5 text-slate-400 group-hover:text-${action.color}-600 transition-colors`} />
                                                    <span className={`text-xs font-medium text-slate-600 group-hover:text-${action.color}-700 transition-colors`}>{action.label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Share & Network Card */}
                                <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Share your portfolio</h3>
                                    <p className="text-sm text-slate-500 mb-6">
                                        Share your link on social media, in your resume, or directly with recruiters to stand out.
                                    </p>

                                    {portfolioUrl ? (
                                        <div className="mt-auto space-y-2 sm:space-y-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleCopy(portfolioUrl)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                                            >
                                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                {copied ? "Copied!" : "Copy Link"}
                                            </motion.button>

                                            <motion.a
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                href={`https://twitter.com/intent/tweet?text=Check out my new portfolio built with MyFolio! 🚀&url=${portfolioUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl text-sm font-bold transition-colors"
                                            >
                                                Share on Twitter
                                            </motion.a>
                                        </div>
                                    ) : (
                                        <div className="mt-auto p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                            <Globe className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs text-slate-500 font-medium">Publish your portfolio to get a shareable link.</p>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Audience Insights Card */}
                                <motion.div variants={itemVariants} className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <ChartNoAxesColumn className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Audience Insights</h3>
                                            <p className="text-sm text-slate-500">Breakdown of devices your visitors are using.</p>
                                        </div>
                                    </div>

                                    {dashData?.analytics?.totalViews > 0 ? (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                                <Monitor className="w-6 h-6 text-slate-400 mb-2" />
                                                <div className="text-2xl font-bold text-slate-900">{dashData.analytics.devices.desktop || 0}</div>
                                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Desktop</div>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                                <Smartphone className="w-6 h-6 text-slate-400 mb-2" />
                                                <div className="text-2xl font-bold text-slate-900">{dashData.analytics.devices.mobile || 0}</div>
                                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Mobile</div>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                                <Tablet className="w-6 h-6 text-slate-400 mb-2" />
                                                <div className="text-2xl font-bold text-slate-900">{dashData.analytics.devices.tablet || 0}</div>
                                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Tablet</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 bg-slate-50 border border-slate-100 border-dashed rounded-xl text-center">
                                            <p className="text-sm text-slate-500 font-medium">Not enough data to show insights yet. Share your portfolio to get views!</p>
                                        </div>
                                    )}
                                </motion.div>

                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
