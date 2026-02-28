import React from 'react'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

function Hero() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };
    return (
        <>
            {/* ================= HERO SECTION ================= */}
            <section className="pt-24 pb-16 md:pt-28 md:pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Portfolio Builder</span>
                    </div>

                    <h1 className="text-5xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight text-slate-900 text-center md:text-left">
                        Build your career. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Without the code.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                        Create an AI-powered portfolio in minutes, customize everything, and launch it on your own domain — no design or coding skills needed.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2">
                            
                            Get Started
                        </button>
                        <button className="px-8 py-3 rounded-md font-semibold text-slate-700 b bg-gray-50 shadow-md hover:bg-gray-100 border-none">
                            How it works?
                        </button>

                    </div>

                    {/* <div className="mt-8 items-center gap-4 text-sm text-slate-500 hidden md:flex">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs overflow-hidden`}>
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 10,000+ students & job seekers</p>
                    </div> */}
                </motion.div>

                {/* Abstract UI Representation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20" />

                    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">

                        {/* ===== Browser Header ===== */}
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-4">
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-400" />
                                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                <span className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="bg-white px-4 py-1 rounded-md text-xs text-slate-400 flex-1 text-center border border-slate-100">
                                manish.myfolio.fun
                            </div>
                        </div>

                        {/* ===== WEBSITE CONTENT ===== */}
                        <div className="p-6 space-y-10">

                            {/* ===== NAVBAR ===== */}
                            <div className="flex items-center justify-between">
                                <div className="h-6 w-28 bg-slate-200 rounded" />
                                <div className="hidden md:flex gap-6">
                                    <div className="h-3 w-10 bg-slate-100 rounded" />
                                    <div className="h-3 w-12 bg-slate-100 rounded" />
                                    <div className="h-3 w-14 bg-slate-100 rounded" />
                                </div>
                                <div className="h-8 w-20 bg-red-500/50 rounded-full" />
                            </div>

                            {/* ===== HERO SECTION ===== */}
                            <div className="grid grid-cols-2 gap-6 items-center">
                                {/* Left text */}
                                <div>
                                    <div className="h-6 w-40 bg-slate-200 rounded mb-3" />
                                    <div className="h-4 w-56 bg-slate-100 rounded mb-2" />
                                    <div className="h-4 w-48 bg-slate-100 rounded mb-4" />
                                    <div className="h-9 w-28 bg-red-600/50 rounded-full" />
                                </div>

                                {/* Right image */}
                                <div className="h-32 rounded-xl bg-gradient-to-br from-red-100 to-green-100 border border-red-200" />
                            </div>

                            {/* ===== FEATURE / PROJECT SECTION ===== */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border">
                                    <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
                                    <div className="h-3 w-full bg-slate-100 rounded" />
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border">
                                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                                    <div className="h-3 w-full bg-slate-100 rounded" />
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border">
                                    <div className="h-4 w-16 bg-slate-200 rounded mb-2" />
                                    <div className="h-3 w-full bg-slate-100 rounded" />
                                </div>
                            </div>

                            {/* ===== AI INDICATOR ===== */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                    <span className="text-xs font-medium text-indigo-600">
                                        AI is generating content for your portfolio
                                    </span>
                                </div>
                                <div className="h-2 bg-indigo-200/70 rounded mb-2" />
                                <div className="h-2 w-3/4 bg-indigo-200/70 rounded" />
                            </div>

                        </div>
                    </div>
                </motion.div>

            </section>
        </>
    )
}

export default Hero