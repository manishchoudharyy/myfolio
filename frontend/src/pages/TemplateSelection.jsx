import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check, Eye } from "lucide-react";
import { templateAPI, portfolioAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const templatePreviews = {
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

const TemplateSelection = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedTemplateSlug, setSelectedTemplateSlug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        console.log("Select", selectedTemplate, selectedTemplateSlug)
    }, [selectedTemplate]);
    const fetchTemplates = async () => {
        try {
            const res = await templateAPI.getAll();
            console.log("Templates", res.data.data)
            setTemplates(res.data.data);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async () => {
        if (!selectedTemplate) return;
        setCreating(true);
        try {
            const res = await portfolioAPI.create({ templateId: selectedTemplate, templateSlug: selectedTemplateSlug });
            const portfolioId = res.data.data.portfolioId;
            console.log("handle select", res)
            navigate(`/editor/${portfolioId}`);
        } catch (error) {
            console.error("Failed to create portfolio:", error);
            alert("Failed to create portfolio. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4 border border-blue-100">
                        Step 1 of 3
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                        Choose your template
                    </h1>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Pick a design that matches your style. Don't worry — you can always change it later.
                    </p>
                </motion.div>

                {/* Template Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {templates.map((template, index) => {
                        const preview = templatePreviews[template.slug] || templatePreviews.minimal;
                        const isSelected = selectedTemplate === template._id;

                        return (
                            <motion.div
                                key={template._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => { setSelectedTemplate(template._id); setSelectedTemplateSlug(template.slug) }}
                                className={`relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 group ${isSelected
                                    ? "border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]"
                                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                    }`}
                            >
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                {/* Preview mockup */}
                                <div className={`bg-gradient-to-br ${preview.gradient} p-6 h-52 relative overflow-hidden`}>
                                    {/* Mini portfolio mockup */}
                                    <div className="bg-white rounded-xl shadow-lg p-4 transform group-hover:scale-105 transition-transform duration-500">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-8 h-8 rounded-full ${preview.accent}`} />
                                            <div>
                                                <div className="h-2.5 w-20 bg-slate-200 rounded" />
                                                <div className="h-2 w-14 bg-slate-100 rounded mt-1" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-slate-100 rounded" />
                                            <div className="h-2 w-4/5 bg-slate-100 rounded" />
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <div className={`h-6 w-16 rounded-md ${preview.accent} opacity-80`} />
                                            <div className="h-6 w-16 rounded-md bg-slate-100" />
                                        </div>
                                    </div>
                                </div>

                                {/* Template info */}
                                <div className="p-5 bg-white">
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {template.description || preview.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={handleSelect}
                        disabled={!selectedTemplate || creating}
                        className={`px-10 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center gap-2 ${selectedTemplate
                            ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300"
                            : "bg-slate-300 cursor-not-allowed"
                            }`}
                    >
                        {creating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Continue with this template →"
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default TemplateSelection;
