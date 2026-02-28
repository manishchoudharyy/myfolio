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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-5 border border-blue-100">
                <Sparkles className="w-4 h-4" /> Let's get started
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                How would you like to build?
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
                Choose how you'd like to provide your information. Either way, AI will help you create an amazing portfolio!
            </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
            {/* Resume Upload */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={onChooseResume}
                className="text-left bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-400 transition-all group shadow-sm hover:shadow-lg cursor-pointer"
            >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Resume</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Upload your PDF resume and AI will automatically extract all your information — name, skills, experience, projects, and more.
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                    Upload PDF <ArrowRight className="w-4 h-4" />
                </div>
            </motion.button>

            {/* Chat with AI */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={onChooseChat}
                className="text-left bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-purple-400 transition-all group shadow-sm hover:shadow-lg cursor-pointer"
            >
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-100 transition-colors">
                    <MessageCircle className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Chat with AI</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Don't have a resume? No problem! Our AI will ask you simple questions one-by-one and build your portfolio step by step.
                </p>
                <div className="flex items-center text-purple-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                    Start chatting <ArrowRight className="w-4 h-4" />
                </div>
            </motion.button>
        </div>
    </div>
);

export default MethodSelect;
