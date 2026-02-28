import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FileText, Sparkles, Wand2, Palette, Smartphone, Monitor } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        description:
            "Get started in seconds. Sign up and unlock your personal space to build a professional portfolio."
    },
    {
        number: "02",
        title: "Chat with AI or Upload Resume",
        description:
            "Already have a resume? Upload it. Don’t have one? No worries — chat with our AI and let it collect your details effortlessly."
    },
    {
        number: "03",
        title: "Choose Template & Go Live",
        description:
            "Pick a template that matches your style, choose your custom subdomain, and publish instantly. Your portfolio goes live on your own professional link."
    }
];

const Step = ({ number, title, description }) => (
    <div className="flex gap-4 items-start group">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Simple Process
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            From Zero to Live <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">in 3 Simple Steps</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-10 max-w-lg">
                            Stop wasting hours on design and coding. Focus on your work, and let MyFolio handle the presentation.
                        </p>

                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Step {...step} />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <button className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
                                Start Building Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Visual (Ecosystem) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="bg-slate-50 rounded-3xl p-8 h-[600px] flex items-center justify-center relative overflow-hidden border border-slate-100 shadow-2xl group">
                            {/* Background Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>

                            {/* Floating Icons Background */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute top-20 left-12 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 text-blue-500"
                            >
                                <FileText size={24} />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-32 right-12 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 text-purple-500"
                            >
                                <Palette size={24} />
                            </motion.div>

                            {/* CENTRAL LAPTOP MOCKUP */}
                            <div className="relative z-10 w-80 md:w-96 aspect-video bg-white rounded-xl shadow-2xl border-4 border-slate-200 overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
                                {/* Laptop Screen Header */}
                                <div className="bg-slate-50 h-6 border-b border-slate-100 flex items-center px-3 gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                {/* Laptop Screen Content */}
                                <div className="p-4 space-y-4 bg-white h-full relative overflow-hidden">
                                    {/* Hero Content */}
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex-shrink-0 animate-pulse"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="w-3/4 h-3 bg-slate-100 rounded animate-pulse"></div>
                                            <div className="w-1/2 h-2 bg-slate-50 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    {/* Grid Content */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="aspect-square bg-slate-50 rounded border border-slate-50"></div>
                                        <div className="aspect-square bg-slate-50 rounded border border-slate-50"></div>
                                    </div>

                                    {/* AI Scanner Effect */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_3s_ease-in-out_infinite]" style={{ top: '30%' }}></div>
                                </div>
                            </div>

                            {/* MOBILE MOCKUP leaning on Laptop */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="absolute -bottom-4 right-20 w-32 h-64 bg-slate-900 rounded-[2rem] border-4 border-slate-800 shadow-2xl z-20 overflow-hidden"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-b-xl z-20"></div>
                                <div className="w-full h-full bg-white relative">
                                    <div className="p-3 pt-8 space-y-3">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto"></div>
                                        <div className="w-20 h-2 bg-slate-100 rounded mx-auto"></div>
                                        <div className="w-full aspect-square bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center text-blue-200">
                                            <Wand2 size={24} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Connection Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: 0.6, type: "spring" }}
                                viewport={{ once: true }}
                                className="absolute top-[40%] right-[15%] z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-300"
                            >
                                <Sparkles size={20} className="animate-spin-slow" />
                            </motion.div>

                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Custom Animation Keyframes for Scanner */}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </section>
    );
};

export default HowItWorks;
