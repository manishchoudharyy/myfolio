import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, FileText, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Hero() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => navigate(isAuthenticated ? '/dashboard' : '/login');

    return (
        <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 overflow-hidden">

            {/* Subtle background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f010_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f010_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {/* Soft radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-blue-100/50 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

                    {/* ── Left: Text content ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-5"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI-Powered Portfolio Builder
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-slate-900 mb-5">
                            Build your career.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Without the code.
                            </span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-base sm:text-lg text-slate-500 mb-7 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Create an AI-powered portfolio in minutes, customize everything, and launch on your own domain — no design or coding skills needed.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleGetStarted}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
                            >
                                Get Started Free <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <a
                                href="#how-it-works"
                                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                            >
                                See how it works
                            </a>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                            <div className="flex -space-x-2">
                                {[11, 12, 13, 14].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/40?img=${i}`}
                                        alt="User"
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-slate-500">
                                <span className="font-semibold text-slate-700">500+</span> portfolios created
                            </p>
                        </div>
                    </motion.div>

                    {/* ── Right: Browser mockup ───────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="relative px-8 sm:px-10 lg:px-0"
                    >
                        {/* Glow behind card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl" />

                        {/* Browser chrome */}
                        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">

                            {/* Browser top bar */}
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-red-400" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <span className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                    <span className="text-xs text-slate-400 font-mono truncate">manish.myfolio.fun</span>
                                </div>
                            </div>

                            {/* Simulated portfolio page */}
                            <div className="p-5 space-y-4 bg-white">

                                {/* Profile row */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0">M</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="h-3.5 w-28 bg-slate-800 rounded mb-1.5" />
                                        <div className="h-2.5 w-36 bg-slate-200 rounded" />
                                    </div>
                                    <div className="h-8 w-20 bg-blue-600 rounded-lg shrink-0" />
                                </div>

                                {/* Section divider */}
                                <div className="h-px bg-slate-100" />

                                {/* Skills chips */}
                                <div>
                                    <div className="h-2.5 w-14 bg-slate-300 rounded mb-2.5" />
                                    <div className="flex flex-wrap gap-1.5">
                                        {['React', 'Node.js', 'MongoDB', 'TypeScript'].map((s) => (
                                            <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100 font-medium">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Project cards mini */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    {['E-commerce App', 'Chat Bot'].map((title) => (
                                        <div key={title} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="h-2.5 w-4/5 bg-slate-700 rounded mb-2" />
                                            <div className="h-2 w-full bg-slate-200 rounded mb-1" />
                                            <div className="h-2 w-3/4 bg-slate-200 rounded" />
                                        </div>
                                    ))}
                                </div>

                                {/* AI chat indicator */}
                                <motion.div
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3"
                                >
                                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="h-2.5 w-44 bg-blue-200 rounded mb-1.5" />
                                        <div className="h-2 w-28 bg-blue-100 rounded" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating badge — left (hidden on very small screens) */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            className="hidden sm:flex absolute -left-4 lg:-left-8 top-12 bg-white border border-slate-200 rounded-2xl shadow-lg px-3 py-2.5 items-center gap-2.5"
                        >
                            <div className="w-7 h-7 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">Resume parsed</p>
                                <p className="text-[10px] text-slate-400">AI extracted 12 fields</p>
                            </div>
                        </motion.div>

                        {/* Floating badge — right (hidden on very small screens) */}
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                            className="hidden sm:flex absolute -right-4 lg:-right-6 bottom-12 bg-white border border-slate-200 rounded-2xl shadow-lg px-3 py-2.5 items-center gap-2.5"
                        >
                            <div className="w-7 h-7 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">Portfolio live!</p>
                                <p className="text-[10px] text-slate-400">manish.myfolio.fun</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero;