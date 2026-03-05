import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Msg = ({ type, text }) => {
    if (!text) return null;
    const isError = type === "error";
    const Icon = isError ? AlertCircle : CheckCircle2;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 px-4 py-3 sm:py-3.5 rounded-xl border flex items-start sm:items-center gap-2.5 overflow-hidden font-bold text-sm ${isError ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}
            >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-snug">{text}</span>
            </motion.div>
        </AnimatePresence>
    );
};

export default Msg;
