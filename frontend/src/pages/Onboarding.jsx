import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { aiAPI, portfolioAPI, templateAPI } from "../services/api";

import MethodSelect from "../components/onboarding/MethodSelect";
import ResumeUpload from "../components/onboarding/ResumeUpload";
import AIChat from "../components/onboarding/AIChat";
import TemplateGrid from "../components/onboarding/TemplateGrid";
import PreviewRefine from "../components/onboarding/PreviewRefine";
import PublishStep from "../components/onboarding/PublishStep";

const STEPS = ["method", "resume", "chat", "template", "preview", "publish"];

const Onboarding = () => {
    const [step, setStep] = useState("method");
    const [collectedData, setCollectedData] = useState({});
    const [sessionId, setSessionId] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedTemplateSlug, setSelectedTemplateSlug] = useState(null);
    const [portfolioId, setPortfolioId] = useState(null);
    const [refineSessionId, setRefineSessionId] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Check if user already has a portfolio → go to preview/refine
    useEffect(() => {
        checkExistingPortfolio();
    }, []);

    const checkExistingPortfolio = async () => {
        try {
            const res = await portfolioAPI.getMyPortfolio();
            if (res.data.data) {
                setPortfolioId(res.data.data.id);
                setCollectedData(res.data.data.data || {});
                setSelectedTemplate(res.data.data.templateId);
                setSelectedTemplateSlug(res.data.data.templateSlug);
                setStep("preview");
            } else {
                // Check for active onboarding session
                const sessionRes = await aiAPI.getSession();
                if (sessionRes.data.data) {
                    setSessionId(sessionRes.data.data.sessionId);
                    setCollectedData(sessionRes.data.data.collectedData || {});
                    setStep("chat");
                }
            }
        } catch (err) {
            console.error("Check existing:", err);
        }
    };

    // Create portfolio after template selection
    const handleCreatePortfolio = async (templateSlug) => {
        try {
            // Polish the data first
            let polishedData = collectedData;
            try {
                const polishRes = await aiAPI.polish(collectedData);
                if (polishRes.data.data) {
                    polishedData = polishRes.data.data;
                }
            } catch {
                // Use raw data if polish fails
            }

            // Find template ObjectId from slug
            const templatesRes = await templateAPI.getAll();
            const template = templatesRes.data.data.find((t) => t.slug === templateSlug);
            const templateId = template?._id || templateSlug;

            // Create portfolio with templateId (ObjectId) + templateSlug + data
            const res = await portfolioAPI.create({
                templateId,
                templateSlug,
                data: polishedData,
            });
            const pId = res.data.data.portfolioId;

            setPortfolioId(pId);
            setCollectedData(polishedData);
            setSelectedTemplate(templateSlug);
            setStep("preview");
        } catch (error) {
            console.error("Create portfolio error:", error);
        }
    };

    // Step indicator
    const currentIdx = STEPS.indexOf(step);
    const progressSteps = [
        { key: "method", label: "Start" },
        { key: "data", label: "Your Info" },
        { key: "template", label: "Template" },
        { key: "preview", label: "Preview" },
        { key: "publish", label: "Publish" },
    ];

    const getProgressIdx = () => {
        if (step === "method") return 0;
        if (step === "resume" || step === "chat") return 1;
        if (step === "template") return 2;
        if (step === "preview") return 3;
        if (step === "publish") return 4;
        return 0;
    };

    const canGoBack = ["resume", "chat", "template"].includes(step);

    const handleBack = () => {
        if (step === "resume" || step === "chat") setStep("method");
        else if (step === "template") setStep("chat");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Top bar with progress */}
            {step !== "preview" && (
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {canGoBack && (
                                <button onClick={handleBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                                </button>
                            )}
                            <h1 className="font-bold text-slate-900">Create Portfolio</h1>
                        </div>

                        {/* Progress dots */}
                        <div className="flex items-center gap-2">
                            {progressSteps.map((ps, i) => (
                                <div key={ps.key} className="flex items-center gap-2">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full transition-colors ${i <= getProgressIdx()
                                            ? "bg-blue-600"
                                            : "bg-slate-200"
                                            }`}
                                    />
                                    {i < progressSteps.length - 1 && (
                                        <div className={`w-6 h-0.5 ${i < getProgressIdx() ? "bg-blue-600" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </header>
            )}

            {/* Step content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === "method" && (
                        <MethodSelect
                            onChooseResume={() => setStep("resume")}
                            onChooseChat={() => setStep("chat")}
                        />
                    )}

                    {step === "resume" && (
                        <ResumeUpload
                            onParsed={(data) => {
                                setCollectedData(data);
                                setStep("template");
                            }}
                        />
                    )}

                    {step === "chat" && (
                        <AIChat
                            sessionId={sessionId}
                            collectedData={collectedData}
                            onSessionId={setSessionId}
                            onDataUpdate={setCollectedData}
                            onComplete={(data) => {
                                setCollectedData(data);
                                setStep("template");
                            }}
                        />
                    )}

                    {step === "template" && (
                        <TemplateGrid
                            onSelect={(slug) => {
                                setSelectedTemplateSlug(slug);
                                handleCreatePortfolio(slug);
                            }}
                        />
                    )}

                    {step === "preview" && (
                        <PreviewRefine
                            portfolioId={portfolioId}
                            portfolioData={collectedData}
                            templateId={selectedTemplate}
                            templateSlug={selectedTemplateSlug}
                            refineSessionId={refineSessionId}
                            onSessionId={setRefineSessionId}
                            onDataUpdate={setCollectedData}
                            onPublish={() => setStep("publish")}
                            onChangeTemplate={() => setStep("template")}
                        />
                    )}

                    {step === "publish" && (
                        <PublishStep
                            portfolioId={portfolioId}
                            onPublished={() => navigate("/dashboard")}
                            onBack={() => setStep("preview")}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
