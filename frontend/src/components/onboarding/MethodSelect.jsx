import React from "react";
import { motion } from "motion/react";
import { FileText, MessageCircle, Sparkles, ArrowRight } from "lucide-react";

const MethodSelect = ({ onChooseResume, onChooseChat }) => (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Let's build
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                How would you like to start?
            </h2>
            <p className="text-slate-500 max-w-md mx-auto font-medium">
                Choose how you'd like to provide your information. Either way, AI will help you craft a stunning portfolio.
            </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
            {/* Resume Upload */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4 }}
                onClick={onChooseResume}
                className="text-left bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-400 hover:ring-4 hover:ring-slate-100 transition-all group shadow-sm cursor-pointer"
            >
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:border-slate-800 transition-colors">
                    <FileText className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Upload Resume</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                    Upload your PDF resume and AI will automatically extract your timeline, skills, experience, and projects perfectly.
                </p>
                <div className="flex items-center text-slate-900 font-bold text-sm gap-2 group-hover:gap-3 transition-all">
                    Upload PDF <ArrowRight className="w-4 h-4" />
                </div>
            </motion.button>

            {/* Chat with AI */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4 }}
                onClick={onChooseChat}
                className="text-left bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-400 hover:ring-4 hover:ring-slate-100 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-6 right-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">Popular</span>
                </div>
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:border-slate-800 transition-colors">
                    <MessageCircle className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Chat with AI</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium pr-4">
                    Don't have a resume? No problem! Our AI will interview you and build your portfolio step by step.
                </p>
                <div className="flex items-center text-slate-900 font-bold text-sm gap-2 group-hover:gap-3 transition-all">
                    Start chatting <ArrowRight className="w-4 h-4" />
                </div>
            </motion.button>
        </div>
    </div>
);

export default MethodSelect;
