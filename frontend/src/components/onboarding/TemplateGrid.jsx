import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { templateAPI } from "../../services/api";

const templateStyles = {
    minimal: {
        gradient: "from-slate-100 to-slate-200",
        accent: "bg-slate-800",
        description: "Clean lines, whitespace-focused, typography-driven",
    },
    modern: {
        gradient: "from-blue-100 to-indigo-200",
        accent: "bg-gradient-to-r from-blue-600 to-indigo-600",
        description: "Gradient accents, bold sections, vibrant feel",
    },
    professional: {
        gradient: "from-emerald-50 to-teal-100",
        accent: "bg-emerald-700",
        description: "Structured layout, corporate essence, refined",
    },
    fresher: {
        gradient: "from-gray-800 to-gray-900",
        accent: "bg-gradient-to-r from-blue-500 to-teal-400",
        description: "Dark theme, modern gradients, perfect for freshers",
    },
};

const TemplateGrid = ({ onSelect }) => {
    const [templates, setTemplates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await templateAPI.getAll();
            setTemplates(res.data.data);
        } catch (err) {
            console.error("Failed to fetch templates:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!selected) return;
        const template = templates.find((t) => t._id === selected);
        setCreating(true);
        onSelect(template?.slug || selected);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose your template</h2>
                <p className="text-slate-500">Pick a design that matches your vibe — you can change it later!</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {templates.map((template, i) => {
                    const style = templateStyles[template.slug] || templateStyles.minimal;
                    const isSelected = selected === template._id;

                    return (
                        <motion.div
                            key={template._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => setSelected(template._id)}
                            className={`relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all group ${isSelected
                                    ? "border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]"
                                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                            )}

                            <div className={`bg-gradient-to-br ${style.gradient} p-5 h-40 relative overflow-hidden`}>
                                <div className="bg-white rounded-lg shadow-md p-3 transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-6 h-6 rounded-full ${style.accent}`} />
                                        <div>
                                            <div className="h-2 w-16 bg-slate-200 rounded" />
                                            <div className="h-1.5 w-10 bg-slate-100 rounded mt-1" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-1.5 w-full bg-slate-100 rounded" />
                                        <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white">
                                <h3 className="font-bold text-slate-900 mb-0.5">{template.name}</h3>
                                <p className="text-xs text-slate-500">{template.description || style.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleContinue}
                    disabled={!selected || creating}
                    className={`px-10 py-3.5 rounded-xl font-semibold text-white transition-all flex items-center gap-2 ${selected
                            ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                            : "bg-slate-300 cursor-not-allowed"
                        }`}
                >
                    {creating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating portfolio...
                        </>
                    ) : (
                        "Continue with this template →"
                    )}
                </button>
            </div>
        </div>
    );
};

export default TemplateGrid;
