import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Save, Eye, EyeOff, Sparkles, User, Briefcase, GraduationCap,
    FolderKanban, Award, Mail, Code, ChevronLeft, Globe,
    Plus, Trash2, X, Check, Loader2, CheckCircle2, AlertCircle,
    ExternalLink, Link2, Github
} from "lucide-react";
import { portfolioAPI, aiAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LivePreview from "../components/editor/LivePreview";

/* ─── Section config ─────────────────────────────────── */
const sections = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "contact", label: "Contact", icon: Mail },
];

/* ─── Toast system ───────────────────────────────────── */
const Toast = ({ toasts, removeToast }) => (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
            {toasts.map((t) => (
                <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 60, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 60, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium max-w-xs ${t.type === "success" ? "bg-green-50 border-green-200 text-green-800"
                            : t.type === "error" ? "bg-red-50 border-red-200 text-red-800"
                                : "bg-white border-slate-200 text-slate-800"
                        }`}
                >
                    {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                    {t.type === "error" && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {t.type === "info" && <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />}
                    {t.message}
                    <button onClick={() => removeToast(t.id)} className="ml-auto text-current opacity-40 hover:opacity-80">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);

function useToast() {
    const [toasts, setToasts] = useState([]);
    const add = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);
    const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
    return { toasts, add, remove };
}

/* ─── Reusable input primitives ──────────────────────── */
const Field = ({ label, hint, children }) => (
    <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
        {children}
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
);

const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
    <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all ${className}`}
    />
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => (
    <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all resize-none"
    />
);

const SectionHeader = ({ icon: Icon, title, action }) => (
    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
        {action}
    </div>
);

const AddButton = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold transition-colors"
    >
        <Plus className="w-3.5 h-3.5" /> {label}
    </button>
);

const ItemCard = ({ onRemove, children, title }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-3 shadow-sm group">
        <div className="flex items-start justify-between mb-3">
            {title && <p className="text-sm font-semibold text-slate-700 truncate">{title || "New entry"}</p>}
            <button
                onClick={onRemove}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
        {children}
    </div>
);

const EmptyState = ({ message, onAdd, addLabel }) => (
    <div className="text-center py-12 px-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Plus className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm text-slate-400 mb-3">{message}</p>
        {onAdd && (
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
                <Plus className="w-4 h-4" /> {addLabel}
            </button>
        )}
    </div>
);

/* ─── Section components ─────────────────────────────── */
const AboutSection = ({ data, onChange }) => (
    <div>
        <SectionHeader icon={User} title="About You" />
        <Field label="Full Name">
            <Input value={data.name} onChange={(v) => onChange("name", v)} placeholder="John Doe" />
        </Field>
        <Field label="Professional Title">
            <Input value={data.title} onChange={(v) => onChange("title", v)} placeholder="Full Stack Developer" />
        </Field>
        <Field label="Bio / About" hint="Keep it concise — 2 to 3 sentences work best.">
            <Textarea value={data.about} onChange={(v) => onChange("about", v)} placeholder="Tell your story — who you are, what you do, and what you're passionate about..." rows={5} />
        </Field>
    </div>
);

const SkillsSection = ({ data, onChange }) => {
    const skills = data.skills || [];
    const add = () => onChange("skills", [...skills, { name: "", level: "Intermediate" }]);
    const remove = (i) => onChange("skills", skills.filter((_, idx) => idx !== i));
    const update = (i, field, value) => {
        const updated = [...skills];
        updated[i] = { ...updated[i], [field]: value };
        onChange("skills", updated);
    };
    return (
        <div>
            <SectionHeader icon={Code} title="Skills" action={<AddButton onClick={add} label="Add Skill" />} />
            {skills.length === 0 ? (
                <EmptyState message="No skills added yet. Add your tech stack!" onAdd={add} addLabel="Add First Skill" />
            ) : (
                <div className="space-y-2">
                    {skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                            <input
                                value={skill.name}
                                onChange={(e) => update(i, "name", e.target.value)}
                                placeholder="Skill name (e.g. React)"
                                className="flex-1 text-sm text-slate-900 bg-transparent focus:outline-none placeholder-slate-400"
                            />
                            <select
                                value={skill.level}
                                onChange={(e) => update(i, "level", e.target.value)}
                                className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                                <option>Expert</option>
                            </select>
                            <button onClick={() => remove(i)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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
            <SectionHeader icon={GraduationCap} title="Education" action={<AddButton onClick={add} label="Add" />} />
            {items.length === 0 ? (
                <EmptyState message="No education entries yet." onAdd={add} addLabel="Add Education" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.institution || "New entry"}>
                    <Field label="Institution">
                        <Input value={item.institution} onChange={(v) => update(i, "institution", v)} placeholder="University of Delhi" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Degree">
                            <Input value={item.degree} onChange={(v) => update(i, "degree", v)} placeholder="B.Tech" />
                        </Field>
                        <Field label="Field of Study">
                            <Input value={item.field} onChange={(v) => update(i, "field", v)} placeholder="Computer Science" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Start Year">
                            <Input value={item.startYear} onChange={(v) => update(i, "startYear", v)} placeholder="2020" />
                        </Field>
                        <Field label="End Year">
                            <Input value={item.endYear} onChange={(v) => update(i, "endYear", v)} placeholder="2024 or Present" />
                        </Field>
                    </div>
                    <Field label="Description (optional)">
                        <Textarea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Notable achievements, GPA, activities..." rows={3} />
                    </Field>
                </ItemCard>
            ))}
        </div>
    );
};

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
            <SectionHeader icon={Briefcase} title="Experience" action={<AddButton onClick={add} label="Add" />} />
            {items.length === 0 ? (
                <EmptyState message="No experience entries yet." onAdd={add} addLabel="Add Experience" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.role ? `${item.role} @ ${item.company}` : "New entry"}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Company">
                            <Input value={item.company} onChange={(v) => update(i, "company", v)} placeholder="Google" />
                        </Field>
                        <Field label="Role">
                            <Input value={item.role} onChange={(v) => update(i, "role", v)} placeholder="Software Engineer" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Start Date">
                            <Input value={item.startDate} onChange={(v) => update(i, "startDate", v)} placeholder="Jan 2023" />
                        </Field>
                        <Field label="End Date">
                            <Input value={item.endDate} onChange={(v) => update(i, "endDate", v)} placeholder="Present" disabled={item.current} />
                        </Field>
                    </div>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                        <input type="checkbox" checked={item.current || false} onChange={(e) => update(i, "current", e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                        <span className="text-sm text-slate-600">Currently working here</span>
                    </label>
                    <Field label="Description">
                        <Textarea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Key responsibilities and achievements..." rows={3} />
                    </Field>
                </ItemCard>
            ))}
        </div>
    );
};

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
            <SectionHeader icon={FolderKanban} title="Projects" action={<AddButton onClick={add} label="Add" />} />
            {items.length === 0 ? (
                <EmptyState message="No projects yet. Add your best work!" onAdd={add} addLabel="Add Project" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.title || "New project"}>
                    <Field label="Project Title">
                        <Input value={item.title} onChange={(v) => update(i, "title", v)} placeholder="My Awesome Project" />
                    </Field>
                    <Field label="Description">
                        <Textarea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="What does it do? What problem does it solve?" rows={3} />
                    </Field>
                    <Field label="Tech Stack" hint="Separate with commas — e.g. React, Node.js, MongoDB">
                        <Input
                            value={(item.techStack || []).join(", ")}
                            onChange={(v) => update(i, "techStack", v.split(",").map(s => s.trim()).filter(Boolean))}
                            placeholder="React, Node.js, PostgreSQL"
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Live URL">
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <Input value={item.liveUrl} onChange={(v) => update(i, "liveUrl", v)} placeholder="https://..." className="pl-8" />
                            </div>
                        </Field>
                        <Field label="GitHub URL">
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <Input value={item.githubUrl} onChange={(v) => update(i, "githubUrl", v)} placeholder="https://github.com/..." className="pl-8" />
                            </div>
                        </Field>
                    </div>
                </ItemCard>
            ))}
        </div>
    );
};

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
            <SectionHeader icon={Award} title="Certificates" action={<AddButton onClick={add} label="Add" />} />
            {items.length === 0 ? (
                <EmptyState message="No certificates yet." onAdd={add} addLabel="Add Certificate" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.title || "New certificate"}>
                    <Field label="Certificate Title">
                        <Input value={item.title} onChange={(v) => update(i, "title", v)} placeholder="AWS Certified Developer" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Issuer">
                            <Input value={item.issuer} onChange={(v) => update(i, "issuer", v)} placeholder="Amazon, Google..." />
                        </Field>
                        <Field label="Year / Date">
                            <Input value={item.date} onChange={(v) => update(i, "date", v)} placeholder="2024" />
                        </Field>
                    </div>
                    <Field label="Credential URL (optional)">
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input value={item.url} onChange={(v) => update(i, "url", v)} placeholder="https://..." className="pl-8" />
                        </div>
                    </Field>
                </ItemCard>
            ))}
        </div>
    );
};

const ContactSection = ({ data, onChange }) => {
    const contact = data.contact || {};
    const upd = (field, value) => onChange("contact", { ...contact, [field]: value });
    return (
        <div>
            <SectionHeader icon={Mail} title="Contact Info" />
            <div className="grid sm:grid-cols-2 gap-x-4">
                <Field label="Email">
                    <Input value={contact.email} onChange={(v) => upd("email", v)} placeholder="you@email.com" type="email" />
                </Field>
                <Field label="Phone">
                    <Input value={contact.phone} onChange={(v) => upd("phone", v)} placeholder="+91 98765 43210" />
                </Field>
                <Field label="LinkedIn">
                    <Input value={contact.linkedin} onChange={(v) => upd("linkedin", v)} placeholder="https://linkedin.com/in/..." />
                </Field>
                <Field label="GitHub">
                    <Input value={contact.github} onChange={(v) => upd("github", v)} placeholder="https://github.com/..." />
                </Field>
                <Field label="Twitter / X">
                    <Input value={contact.twitter} onChange={(v) => upd("twitter", v)} placeholder="https://twitter.com/..." />
                </Field>
                <Field label="Personal Website">
                    <Input value={contact.website} onChange={(v) => upd("website", v)} placeholder="https://..." />
                </Field>
            </div>
        </div>
    );
};

/* ─── AI Generate bar ────────────────────────────────── */
const aiPlaceholders = {
    about: "e.g. I'm a final-year CS student who loves building web apps...",
    skills: "e.g. Add React, Node.js, MongoDB as advanced skills",
    education: "e.g. B.Tech in Computer Science from NSIT, 2020-2024",
    experience: "e.g. Worked as SDE intern at Razorpay for 6 months",
    projects: "e.g. Built a food delivery app with React and Firebase",
    certificates: "e.g. Got AWS Cloud Practitioner cert in 2024",
    contact: "e.g. My email is john@gmail.com, GitHub: johndoe",
};

const AIBar = ({ activeSection, onGenerate, loading }) => {
    const [input, setInput] = useState("");
    const handleSubmit = () => {
        if (!input.trim()) return;
        onGenerate(input);
        setInput("");
    };
    return (
        <div className="mb-6 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">
                    AI Generate — {sections.find(s => s.id === activeSection)?.label}
                </span>
            </div>
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                    placeholder={aiPlaceholders[activeSection]}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-violet-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2 transition-colors shrink-0"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="hidden sm:inline">Generate</span>
                </button>
            </div>
        </div>
    );
};

/* ─── Publish Modal ──────────────────────────────────── */
const PublishModal = ({ portfolio, onClose, onPublish, publishing }) => {
    const [subdomain, setSubdomain] = useState(portfolio?.subdomain || "");
    const [available, setAvailable] = useState(portfolio?.subdomain ? true : null);
    const [checking, setChecking] = useState(false);
    const checkTimer = useRef(null);

    const checkSubdomain = async (val) => {
        if (!val.trim()) { setAvailable(null); return; }
        setChecking(true);
        try {
            const res = await portfolioAPI.checkSubdomain(val);
            setAvailable(res.data.data.available);
        } catch {
            setAvailable(false);
        } finally {
            setChecking(false);
        }
    };

    const handleChange = (val) => {
        const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
        setSubdomain(clean);
        setAvailable(null);
        if (checkTimer.current) clearTimeout(checkTimer.current);
        checkTimer.current = setTimeout(() => checkSubdomain(clean), 600);
    };

    const isExisting = portfolio?.subdomain === subdomain;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Publish Portfolio</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Choose your public URL</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Subdomain input */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Your Subdomain
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                value={subdomain}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder="your-name"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all pr-8"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {checking && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
                                {!checking && available === true && <Check className="w-3.5 h-3.5 text-green-500" />}
                                {!checking && available === false && <X className="w-3.5 h-3.5 text-red-500" />}
                            </div>
                        </div>
                        <span className="text-sm text-slate-400 font-medium shrink-0">.myfolio.fun</span>
                    </div>

                    {/* Preview URL */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <ExternalLink className="w-3 h-3" />
                        <span className="font-mono">{subdomain || "your-name"}.myfolio.fun</span>
                    </div>

                    {/* Availability feedback */}
                    <AnimatePresence>
                        {!checking && available !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg ${available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {available ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                {isExisting ? "This is your current subdomain" : available ? "Subdomain is available!" : "Subdomain is already taken"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Publish button */}
                <button
                    onClick={() => onPublish(subdomain)}
                    disabled={(!available && !isExisting) || publishing || !subdomain.trim()}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                    {publishing
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</>
                        : <><Globe className="w-4 h-4" /> {isExisting ? "Re-publish" : "Publish Now"}</>
                    }
                </button>
            </motion.div>
        </motion.div>
    );
};

/* ─── Main Editor ────────────────────────────────────── */
const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toasts, add: toast, remove: removeToast } = useToast();

    const [portfolio, setPortfolio] = useState(null);
    const [activeSection, setActiveSection] = useState("about");
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedIndicator, setSavedIndicator] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [publishModal, setPublishModal] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const saveTimerRef = useRef(null);

    useEffect(() => { fetchPortfolio(); }, [id]);

    const fetchPortfolio = async () => {
        try {
            const res = await portfolioAPI.get(id);
            setPortfolio(res.data.data);
        } catch {
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    /* Auto-save — useRef avoids stale closure issues */
    const autoSave = useCallback((data) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            try {
                setSaving(true);
                await portfolioAPI.update(id, data);
                setSavedIndicator(true);
                setTimeout(() => setSavedIndicator(false), 2000);
            } catch {
                toast("Auto-save failed — check your connection", "error");
            } finally {
                setSaving(false);
            }
        }, 1500);
    }, [id]);

    const updateData = (field, value) => {
        const newData = { ...portfolio.data, [field]: value };
        setPortfolio({ ...portfolio, data: newData });
        autoSave(newData);
    };

    const handleManualSave = async () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        try {
            setSaving(true);
            await portfolioAPI.update(id, portfolio.data);
            toast("Portfolio saved!", "success");
        } catch {
            toast("Save failed. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleAIGenerate = async (input) => {
        setAiLoading(true);
        try {
            const res = await aiAPI.generate(id, activeSection, input);
            if (res.data.data.parsedData) {
                const fresh = await portfolioAPI.get(id);
                setPortfolio(fresh.data.data);
                toast("AI updated your section!", "success");
            }
        } catch {
            toast("AI generation failed. Try again.", "error");
        } finally {
            setAiLoading(false);
        }
    };

    const handlePublish = async (subdomain) => {
        setPublishing(true);
        try {
            await portfolioAPI.update(id, portfolio.data);
            const res = await portfolioAPI.publish(id, subdomain);
            setPublishModal(false);
            toast(`🎉 Live at ${res.data.data.url}`, "success");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch {
            toast("Publishing failed. Please try again.", "error");
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading editor…</p>
                </div>
            </div>
        );
    }

    if (!portfolio) return null;

    const renderSection = () => {
        const props = { data: portfolio.data, onChange: updateData };
        switch (activeSection) {
            case "about": return <AboutSection        {...props} />;
            case "skills": return <SkillsSection       {...props} />;
            case "education": return <EducationSection    {...props} />;
            case "experience": return <ExperienceSection   {...props} />;
            case "projects": return <ProjectsSection     {...props} />;
            case "certificates": return <CertificatesSection {...props} />;
            case "contact": return <ContactSection      {...props} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* ── Top Bar ──────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
                <div className="px-3 sm:px-5 py-3 flex items-center justify-between gap-3">

                    {/* Left */}
                    <div className="flex items-center gap-2 min-w-0">
                        <button
                            onClick={() => navigate("/edit")}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 shrink-0"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                                {portfolio.data?.name || "Portfolio"} — Editor
                            </h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {saving ? (
                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Saving…
                                    </span>
                                ) : savedIndicator ? (
                                    <span className="flex items-center gap-1 text-[11px] text-green-600">
                                        <Check className="w-3 h-3" /> Saved
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-slate-400">Auto-saves as you type</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Preview toggle (mobile only) */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors lg:hidden"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="hidden sm:inline">{showPreview ? "Edit" : "Preview"}</span>
                        </button>

                        {/* Manual save */}
                        <button
                            onClick={handleManualSave}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-semibold text-slate-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">Save</span>
                        </button>

                        {/* Publish */}
                        <button
                            onClick={() => setPublishModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-bold text-white transition-colors shadow-sm"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {portfolio.status === "published" ? "Re-publish" : "Publish"}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Layout ───────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden">

                {/* Sidebar — desktop always visible, hidden mobile when preview */}
                <aside className={`shrink-0 w-14 sm:w-52 bg-white border-r border-slate-200 overflow-y-auto ${showPreview ? "hidden lg:flex" : "flex"} flex-col`}>
                    <nav className="flex-1 p-2 space-y-0.5">
                        {sections.map((sec) => {
                            const Icon = sec.icon;
                            const isActive = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => { setActiveSection(sec.id); setShowPreview(false); }}
                                    className={`w-full flex items-center gap-3 px-2.5 sm:px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-600 rounded-full" />
                                    )}
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span className="hidden sm:inline">{sec.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Editor main panel */}
                <main className={`flex-1 overflow-y-auto ${showPreview ? "hidden lg:block" : ""}`}>
                    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-20">

                        {/* AI Bar */}
                        <AIBar
                            activeSection={activeSection}
                            onGenerate={handleAIGenerate}
                            loading={aiLoading}
                        />

                        {/* Section content */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    {renderSection()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* Live Preview panel */}
                <aside className={`w-full lg:w-[45%] xl:w-2/5 border-l border-slate-200 bg-white overflow-y-auto ${showPreview ? "" : "hidden lg:block"}`}>
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-2.5 flex items-center justify-between z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-slate-400">Live</span>
                        </div>
                    </div>
                    <LivePreview
                        data={portfolio.data}
                        templateId={portfolio.templateId}
                        templateSlug={portfolio.templateSlug}
                    />
                </aside>
            </div>

            {/* ── Mobile bottom section tabs ────────────────── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 flex overflow-x-auto">
                {sections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                        <button
                            key={sec.id}
                            onClick={() => { setActiveSection(sec.id); setShowPreview(false); }}
                            className={`flex-1 min-w-[3.5rem] flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-semibold transition-colors ${isActive ? "text-blue-600 border-t-2 border-blue-600" : "text-slate-400 border-t-2 border-transparent"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="truncate max-w-full">{sec.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Publish Modal ─────────────────────────────── */}
            <AnimatePresence>
                {publishModal && (
                    <PublishModal
                        portfolio={portfolio}
                        onClose={() => setPublishModal(false)}
                        onPublish={handlePublish}
                        publishing={publishing}
                    />
                )}
            </AnimatePresence>

            {/* ── Toast Notifications ───────────────────────── */}
            <Toast toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default Editor;
