import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Save, Eye, EyeOff, Sparkles, User, Briefcase, GraduationCap,
    FolderKanban, Award, Mail, Code, ChevronLeft, Globe, ArrowRight,
    Plus, Trash2, X, Check, Loader2
} from "lucide-react";
import { portfolioAPI, aiAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LivePreview from "../components/editor/LivePreview";

const sections = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "contact", label: "Contact", icon: Mail },
];

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [portfolio, setPortfolio] = useState(null);
    const [activeSection, setActiveSection] = useState("about");
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [publishModal, setPublishModal] = useState(false);
    const [subdomain, setSubdomain] = useState("");
    const [subdomainAvailable, setSubdomainAvailable] = useState(null);
    const [publishing, setPublishing] = useState(false);
    const [saveTimeout, setSaveTimeout] = useState(null);

    useEffect(() => {
        fetchPortfolio();
    }, [id]);

    const fetchPortfolio = async () => {
        try {
            const res = await portfolioAPI.get(id);
            setPortfolio(res.data.data);
        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    // Auto-save with debounce
    const autoSave = useCallback(
        (data) => {
            if (saveTimeout) clearTimeout(saveTimeout);
            const timeout = setTimeout(async () => {
                try {
                    setSaving(true);
                    await portfolioAPI.update(id, data);
                } catch (err) {
                    console.error("Auto-save failed:", err);
                } finally {
                    setSaving(false);
                }
            }, 1500);
            setSaveTimeout(timeout);
        },
        [id, saveTimeout]
    );

    const updateData = (field, value) => {
        const newData = { ...portfolio.data, [field]: value };
        setPortfolio({ ...portfolio, data: newData });
        autoSave(newData);
    };

    const handleManualSave = async () => {
        if (saveTimeout) clearTimeout(saveTimeout);
        try {
            setSaving(true);
            await portfolioAPI.update(id, portfolio.data);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleAIGenerate = async () => {
        if (!aiInput.trim()) return;
        setAiLoading(true);
        try {
            const res = await aiAPI.generate(id, activeSection, aiInput);
            if (res.data.data.parsedData) {
                // Refresh portfolio data after AI update
                const portfolioRes = await portfolioAPI.get(id);
                setPortfolio(portfolioRes.data.data);
            }
            setAiInput("");
        } catch (error) {
            console.error("AI generation failed:", error);
            alert("AI generation failed. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const checkSubdomain = async () => {
        if (!subdomain.trim()) return;
        try {
            const res = await portfolioAPI.checkSubdomain(subdomain);
            setSubdomainAvailable(res.data.data.available);
        } catch {
            setSubdomainAvailable(false);
        }
    };

    const handlePublish = async () => {
        if (!subdomainAvailable) return;
        setPublishing(true);
        try {
            await handleManualSave();
            const res = await portfolioAPI.publish(id, subdomain);
            alert(`🎉 Published! Your portfolio is live at ${res.data.data.url}`);
            navigate("/dashboard");
        } catch (error) {
            alert("Publishing failed. Please try again.");
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!portfolio) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="font-bold text-lg text-slate-900 hidden sm:block">
                            Portfolio Editor
                        </h1>
                        {saving && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? "Edit" : "Preview"}
                        </button>
                        <button
                            onClick={handleManualSave}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">Save</span>
                        </button>
                        <button
                            onClick={() => setPublishModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">Publish</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className={`w-16 sm:w-56 shrink-0 bg-white border-r border-slate-200 overflow-y-auto ${showPreview ? "hidden lg:block" : ""}`}>
                    <nav className="p-2 sm:p-3 space-y-1">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => { setActiveSection(section.id); setShowPreview(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span className="hidden sm:inline">{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Editor Panel */}
                <main className={`flex-1 overflow-y-auto ${showPreview ? "hidden lg:block" : ""}`}>
                    <div className="max-w-2xl mx-auto p-4 sm:p-6">
                        {/* AI Generate Bar */}
                        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-semibold text-indigo-700">
                                    AI Generate — {sections.find(s => s.id === activeSection)?.label}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAIGenerate()}
                                    placeholder={`Describe your ${activeSection}...`}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-indigo-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                />
                                <button
                                    onClick={handleAIGenerate}
                                    disabled={aiLoading || !aiInput.trim()}
                                    className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {aiLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    Generate
                                </button>
                            </div>
                        </div>

                        {/* Section Forms */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeSection === "about" && (
                                    <AboutSection data={portfolio.data} onChange={updateData} />
                                )}
                                {activeSection === "skills" && (
                                    <SkillsSection data={portfolio.data} onChange={updateData} />
                                )}
                                {activeSection === "education" && (
                                    <EducationSection data={portfolio.data} onChange={updateData} />
                                )}
                                {activeSection === "experience" && (
                                    <ExperienceSection data={portfolio.data} onChange={updateData} />
                                )}
                                {activeSection === "projects" && (
                                    <ProjectsSection data={portfolio.data} onChange={updateData} />
                                )}
                                {activeSection === "certificates" && (
                                    <CertificatesSection data={portfolio.data} onChange={updateData} />
                                )}
                                {activeSection === "contact" && (
                                    <ContactSection data={portfolio.data} onChange={updateData} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Live Preview (Desktop: always, Mobile: toggle) */}
                <aside className={`w-full lg:w-1/2 xl:w-2/5 border-l border-slate-200 bg-white overflow-y-auto ${showPreview ? "" : "hidden lg:block"}`}>
                    <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between z-10">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs text-slate-400">Live</span>
                        </div>
                    </div>
                    <LivePreview data={portfolio.data} templateId={portfolio.templateId} templateSlug={portfolio.templateSlug} />
                </aside>
            </div>

            {/* Publish Modal */}
            <AnimatePresence>
                {publishModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                        onClick={() => setPublishModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Publish Portfolio</h2>
                                <button onClick={() => setPublishModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Choose your subdomain
                            </label>
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    value={subdomain}
                                    onChange={(e) => {
                                        setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                                        setSubdomainAvailable(null);
                                    }}
                                    placeholder="your-name"
                                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    onClick={checkSubdomain}
                                    disabled={!subdomain.trim()}
                                    className="px-4 py-3 rounded-lg bg-slate-100 text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    Check
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">
                                Your portfolio: <span className="font-medium text-slate-600">{subdomain || "your-name"}.myfolio.fun</span>
                            </p>

                            {subdomainAvailable !== null && (
                                <div className={`flex items-center gap-2 text-sm mb-4 px-3 py-2 rounded-lg ${subdomainAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                    }`}>
                                    {subdomainAvailable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    {subdomainAvailable ? "Subdomain is available!" : "Subdomain is taken"}
                                </div>
                            )}

                            <button
                                onClick={handlePublish}
                                disabled={!subdomainAvailable || publishing}
                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {publishing ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                                ) : (
                                    <><Globe className="w-4 h-4" /> Publish Now</>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============== SECTION COMPONENTS ==============

const InputField = ({ label, value, onChange, placeholder, type = "text", multiline = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        {multiline ? (
            <textarea
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none"
            />
        ) : (
            <input
                type={type}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
        )}
    </div>
);

// About Section
const AboutSection = ({ data, onChange }) => (
    <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">About You</h2>
        <InputField label="Full Name" value={data.name} onChange={(v) => onChange("name", v)} placeholder="John Doe" />
        <InputField label="Professional Title" value={data.title} onChange={(v) => onChange("title", v)} placeholder="Full Stack Developer" />
        <InputField label="About" value={data.about} onChange={(v) => onChange("about", v)} placeholder="Tell your story..." multiline />
    </div>
);

// Skills Section
const SkillsSection = ({ data, onChange }) => {
    const skills = data.skills || [];
    const addSkill = () => onChange("skills", [...skills, { name: "", level: "Intermediate" }]);
    const removeSkill = (i) => onChange("skills", skills.filter((_, idx) => idx !== i));
    const updateSkill = (i, field, value) => {
        const updated = [...skills];
        updated[i] = { ...updated[i], [field]: value };
        onChange("skills", updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Skills</h2>
                <button onClick={addSkill} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add Skill
                </button>
            </div>
            {skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                    <input
                        value={skill.name}
                        onChange={(e) => updateSkill(i, "name", e.target.value)}
                        placeholder="Skill name"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <select
                        value={skill.level}
                        onChange={(e) => updateSkill(i, "level", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                    </select>
                    <button onClick={() => removeSkill(i)} className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            {skills.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No skills added yet. Click "Add Skill" or use AI to generate.</p>
            )}
        </div>
    );
};

// Education Section
const EducationSection = ({ data, onChange }) => {
    const items = data.education || [];
    const add = () => onChange("education", [...items, { institution: "", degree: "", field: "", startYear: "", endYear: "", description: "" }]);
    const remove = (i) => onChange("education", items.filter((_, idx) => idx !== i));
    const update = (i, field, value) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [field]: value };
        onChange("education", updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Education</h2>
                <button onClick={add} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 relative">
                    <button onClick={() => remove(i)} className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <InputField label="Institution" value={item.institution} onChange={(v) => update(i, "institution", v)} placeholder="University name" />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Degree" value={item.degree} onChange={(v) => update(i, "degree", v)} placeholder="B.Tech" />
                        <InputField label="Field" value={item.field} onChange={(v) => update(i, "field", v)} placeholder="Computer Science" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Start Year" value={item.startYear} onChange={(v) => update(i, "startYear", v)} placeholder="2020" />
                        <InputField label="End Year" value={item.endYear} onChange={(v) => update(i, "endYear", v)} placeholder="2024" />
                    </div>
                    <InputField label="Description" value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Notable achievements..." multiline />
                </div>
            ))}
            {items.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No education added yet.</p>
            )}
        </div>
    );
};

// Experience Section
const ExperienceSection = ({ data, onChange }) => {
    const items = data.experience || [];
    const add = () => onChange("experience", [...items, { company: "", role: "", startDate: "", endDate: "", description: "", current: false }]);
    const remove = (i) => onChange("experience", items.filter((_, idx) => idx !== i));
    const update = (i, field, value) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [field]: value };
        onChange("experience", updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Experience</h2>
                <button onClick={add} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 relative">
                    <button onClick={() => remove(i)} className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Company" value={item.company} onChange={(v) => update(i, "company", v)} placeholder="Company name" />
                        <InputField label="Role" value={item.role} onChange={(v) => update(i, "role", v)} placeholder="Software Engineer" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Start Date" value={item.startDate} onChange={(v) => update(i, "startDate", v)} placeholder="Jan 2023" />
                        <InputField label="End Date" value={item.endDate} onChange={(v) => update(i, "endDate", v)} placeholder="Present" />
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                        <input type="checkbox" checked={item.current} onChange={(e) => update(i, "current", e.target.checked)} className="rounded" />
                        <span className="text-sm text-slate-600">Currently working here</span>
                    </div>
                    <InputField label="Description" value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Key responsibilities..." multiline />
                </div>
            ))}
            {items.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No experience added yet.</p>
            )}
        </div>
    );
};

// Projects Section
const ProjectsSection = ({ data, onChange }) => {
    const items = data.projects || [];
    const add = () => onChange("projects", [...items, { title: "", description: "", techStack: [], liveUrl: "", githubUrl: "" }]);
    const remove = (i) => onChange("projects", items.filter((_, idx) => idx !== i));
    const update = (i, field, value) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [field]: value };
        onChange("projects", updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Projects</h2>
                <button onClick={add} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 relative">
                    <button onClick={() => remove(i)} className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <InputField label="Title" value={item.title} onChange={(v) => update(i, "title", v)} placeholder="Project name" />
                    <InputField label="Description" value={item.description} onChange={(v) => update(i, "description", v)} placeholder="What does it do?" multiline />
                    <InputField
                        label="Tech Stack (comma separated)"
                        value={(item.techStack || []).join(", ")}
                        onChange={(v) => update(i, "techStack", v.split(",").map((s) => s.trim()).filter(Boolean))}
                        placeholder="React, Node.js, MongoDB"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Live URL" value={item.liveUrl} onChange={(v) => update(i, "liveUrl", v)} placeholder="https://..." />
                        <InputField label="GitHub URL" value={item.githubUrl} onChange={(v) => update(i, "githubUrl", v)} placeholder="https://github.com/..." />
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No projects added yet.</p>
            )}
        </div>
    );
};

// Certificates Section
const CertificatesSection = ({ data, onChange }) => {
    const items = data.certificates || [];
    const add = () => onChange("certificates", [...items, { title: "", issuer: "", date: "", url: "" }]);
    const remove = (i) => onChange("certificates", items.filter((_, idx) => idx !== i));
    const update = (i, field, value) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [field]: value };
        onChange("certificates", updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Certificates</h2>
                <button onClick={add} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 relative">
                    <button onClick={() => remove(i)} className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <InputField label="Title" value={item.title} onChange={(v) => update(i, "title", v)} placeholder="Certificate name" />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Issuer" value={item.issuer} onChange={(v) => update(i, "issuer", v)} placeholder="Google, AWS..." />
                        <InputField label="Date" value={item.date} onChange={(v) => update(i, "date", v)} placeholder="2024" />
                    </div>
                    <InputField label="URL" value={item.url} onChange={(v) => update(i, "url", v)} placeholder="https://..." />
                </div>
            ))}
            {items.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No certificates added yet.</p>
            )}
        </div>
    );
};

// Contact Section
const ContactSection = ({ data, onChange }) => {
    const contact = data.contact || {};
    const updateContact = (field, value) => {
        onChange("contact", { ...contact, [field]: value });
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Info</h2>
            <InputField label="Email" value={contact.email} onChange={(v) => updateContact("email", v)} placeholder="you@email.com" type="email" />
            <InputField label="Phone" value={contact.phone} onChange={(v) => updateContact("phone", v)} placeholder="+91 98765 43210" />
            <InputField label="LinkedIn" value={contact.linkedin} onChange={(v) => updateContact("linkedin", v)} placeholder="https://linkedin.com/in/..." />
            <InputField label="GitHub" value={contact.github} onChange={(v) => updateContact("github", v)} placeholder="https://github.com/..." />
            <InputField label="Twitter" value={contact.twitter} onChange={(v) => updateContact("twitter", v)} placeholder="https://twitter.com/..." />
            <InputField label="Website" value={contact.website} onChange={(v) => updateContact("website", v)} placeholder="https://..." />
        </div>
    );
};

export default Editor;
