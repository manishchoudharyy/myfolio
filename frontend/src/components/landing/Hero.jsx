import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, FileText, Wand2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Hero() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => navigate(isAuthenticated ? '/dashboard' : '/login');

    return (
        <section id="home" className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-4 sm:px-6 overflow-hidden bg-noise bg-[var(--color-bg)]">

            {/* Top Light Ray / Glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/50 via-blue-50/10 to-transparent rounded-[100%] blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* ── Left: Text content ─────────────────────── */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
                        }}
                        className="text-center lg:text-left"
                    >
                        {/* Premium Notification Pill */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 12 } } }}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex max-w-max items-center gap-3 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md ring-subtle border border-slate-200/60 shadow-sm mb-6 mx-auto lg:mx-0 cursor-pointer hover:bg-white transition-colors"
                        >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-inner">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-800 pr-2">Introducing Folio AI Builder</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } } }}
                            className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.05]"
                        >
                            Your professional identity. <br className="hidden sm:block" />
                            <span className="relative inline-block mt-2">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-1">Built in seconds.</span>
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "100%", opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                    className="absolute bottom-1 left-0 h-3 bg-indigo-200/60 -rotate-1 skew-x-12 rounded-sm -z-10"
                                />
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            className="text-lg sm:text-xl text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            Stop wrestling with templates. Upload your resume or chat with our AI to generate a stunning, live portfolio instantly.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start"
                        >
                            <motion.button
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGetStarted}
                                className="group flex items-center justify-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgb(0,0,0,0.16)] hover:bg-slate-900 transition-all ring-1 ring-slate-950"
                            >
                                Start Building Free
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                            </motion.button>
                            <motion.a
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                href="#how-it-works"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base text-slate-700 bg-white ring-subtle border border-slate-200/80 hover:bg-slate-50 hover:shadow-sm transition-all"
                            >
                                View Demo
                            </motion.a>
                        </motion.div>

                        {/* Trust Signals */}
                        <motion.div
                            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                            className="flex items-center justify-center lg:justify-start gap-4 pt-4"
                        >
                            <div className="flex -space-x-3">
                                {[11, 12, 13, 44].map((i, index) => (
                                    <motion.img
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (index * 0.1) }}
                                        src={`https://i.pravatar.cc/40?img=${i}`}
                                        alt="User profile"
                                        className="w-10 h-10 rounded-full border-[3px] border-slate-50 object-cover shadow-sm relative hover:z-10 transition-transform hover:scale-110"
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex gap-1 text-amber-400 text-sm">
                                    ★★★★★
                                </div>
                                <span className="text-xs font-semibold text-slate-500">Loved by 5,000+ creators</span>
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* ── Right: Abstracted Editor Mockup ───────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, rotateY: 15, scale: 0.9 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
                        style={{ perspective: 1200 }}
                        className="relative w-full max-w-[500px] mx-auto lg:ml-auto"
                    >
                        {/* Ethereal Glow Behind */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-indigo-500 blur-[100px] rounded-full pointer-events-none"
                        />

                        {/* Premium Floating Browser Window */}
                        <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/60 transform rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500 ring-4 ring-white/20"
                        >

                            {/* Browser Top Bar macOS style */}
                            <div className="bg-slate-100/50 backdrop-blur-md px-4 py-3 flex items-center gap-2 border-b border-slate-200/50">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                </div>
                                <div className="mx-auto flex items-center justify-center h-6 w-48 bg-white/60 rounded-md ring-subtle">
                                    <span className="text-[10px] font-medium text-slate-400 font-mono tracking-wider">folio.new/alex</span>
                                </div>
                            </div>

                            {/* Content Area Wireframe */}
                            <div className="p-6 bg-white/80 aspect-[4/3] flex flex-col gap-6">
                                {/* Header skeleton */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 ring-1 ring-slate-200/50" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-1/3 bg-slate-800 rounded-sm" />
                                        <div className="h-2 w-1/2 bg-slate-200 rounded-sm" />
                                    </div>
                                    <div className="h-8 w-24 bg-slate-900 rounded-full" />
                                </div>

                                {/* AI Scanning Bar Simulation */}
                                <div className="relative h-12 w-full bg-indigo-50/50 rounded-xl border border-indigo-100 overflow-hidden flex items-center px-4 gap-3">
                                    {/* Scanning line animation */}
                                    <motion.div
                                        animate={{ x: [-100, 400] }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                        className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent skew-x-12"
                                    />
                                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                                    <span className="text-xs font-semibold text-indigo-900/70">Extracting specific skills from PDF...</span>
                                </div>

                                {/* Skills Grid Skeleton */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-8 rounded-lg bg-slate-100 ring-1 ring-slate-200/50" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating elements to give depth */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -right-6 top-12 glass-panel p-3 rounded-2xl flex items-center gap-3 z-20"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-inner">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800">Deployed</span>
                                <span className="text-[10px] font-medium text-slate-500">2s ago</span>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}

export default Hero;