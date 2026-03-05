import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Save, Eye, EyeOff, Sparkles, User, Briefcase, GraduationCap,
    FolderKanban, Award, Mail, Code, ChevronLeft, Globe,
    Plus, Trash2, X, Check, Loader2, CheckCircle2, AlertCircle,
    ExternalLink, Link2, Github, GripVertical
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
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium max-w-xs 
                        ${t.type === "success" ? "bg-slate-900 border-slate-800 text-white"
                            : t.type === "error" ? "bg-red-50 border-red-200 text-red-800"
                                : "bg-white border-slate-200 text-slate-800"
                        }`}
                >
                    {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                    {t.type === "error" && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {t.type === "info" && <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />}
                    {t.message}
                    <button onClick={() => removeToast(t.id)} className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity">
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
    <div className="mb-5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">{label}</label>
        {children}
        {hint && <p className="text-xs text-slate-400 mt-1.5 font-medium">{hint}</p>}
    </div>
);

const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
    <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border border-transparent bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all ${className}`}
    />
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => (
    <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl border border-transparent bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all resize-none"
    />
);

const SectionHeader = ({ title, action, description }) => (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-5 border-b border-slate-100 gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

const AddButton = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
    >
        <Plus className="w-4 h-4 shrink-0" /> {label}
    </button>
);

const ItemCard = ({ onRemove, children, title }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm group hover:shadow-md transition-shadow relative"
    >
        <div className="absolute top-5 right-5 flex items-center gap-2">
            <button
                onClick={onRemove}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Remove Item"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>

        {title && (
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 pr-10">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                <h3 className="text-sm font-bold text-slate-800 truncate">{title || "New Entry"}</h3>
            </div>
        )}

        {children}
    </motion.div>
);

const EmptyState = ({ message, onAdd, addLabel }) => (
    <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Plus className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{message}</p>
        {onAdd && (
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-sm focus:ring-4 focus:ring-slate-200"
            >
                <Plus className="w-4 h-4" /> {addLabel}
            </button>
        )}
    </div>
);

/* ─── Section components ─────────────────────────────── */
const AboutSection = ({ data, onChange }) => (
    <div>
        <SectionHeader
            title="Personal Details"
            description="Your identity on the web. Make it brief and impactful."
        />
        <div className="max-w-2xl">
            <Field label="Full Name">
                <Input value={data.name} onChange={(v) => onChange("name", v)} placeholder="e.g. Jane Doe" />
            </Field>
            <Field label="Professional Title" hint="This appears right below your name on most templates.">
                <Input value={data.title} onChange={(v) => onChange("title", v)} placeholder="e.g. Senior Frontend Engineer" />
            </Field>
            <Field label="Bio / About Me" hint="Keep it concise — 2 to 3 sentences work best.">
                <Textarea value={data.about} onChange={(v) => onChange("about", v)} placeholder="Tell your story — who you are, what you do, and what you're passionate about..." rows={5} />
            </Field>
        </div>
    </div>
);

const SkillsSection = ({ data, onChange }) => {
    const skills = data.skills || [];
    const add = () => onChange("skills", [...skills, { name: "" }]);
    const remove = (i) => onChange("skills", skills.filter((_, idx) => idx !== i));
    const update = (i, field, value) => {
        const updated = [...skills];
        updated[i] = { ...updated[i], [field]: value };
        onChange("skills", updated);
    };
    return (
        <div>
            <SectionHeader
                title="Skills & Technologies"
                description="List the tools, languages, and frameworks you're proficient in."
                action={<AddButton onClick={add} label="Add Skill" />}
            />
            {skills.length === 0 ? (
                <EmptyState message="No skills added yet. Showcase your technical arsenal to stand out." onAdd={add} addLabel="Add First Skill" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-4 focus-within:ring-slate-100 focus-within:bg-white focus-within:border-slate-300 transition-all">
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab ml-1 shrink-0" />
                            <input
                                value={skill.name}
                                onChange={(e) => update(i, "name", e.target.value)}
                                placeholder="Skill (e.g. React)"
                                className="flex-1 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder-slate-400 py-1 min-w-0"
                            />
                            <button onClick={() => remove(i)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                <X className="w-4 h-4" />
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
            <SectionHeader
                title="Education"
                description="Your academic background and qualifications."
                action={<AddButton onClick={add} label="Add Education" />}
            />
            {items.length === 0 ? (
                <EmptyState message="No education entries yet. Add your degrees or bootcamp certifications." onAdd={add} addLabel="Add Education Entry" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.institution ? `${item.degree || 'Degree'} at ${item.institution}` : "New Education Entry"}>
                    <Field label="Institution / University">
                        <Input value={item.institution} onChange={(v) => update(i, "institution", v)} placeholder="e.g. Stanford University" />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Degree / Type">
                            <Input value={item.degree} onChange={(v) => update(i, "degree", v)} placeholder="e.g. B.S." />
                        </Field>
                        <Field label="Field of Study">
                            <Input value={item.field} onChange={(v) => update(i, "field", v)} placeholder="e.g. Computer Science" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Year">
                            <Input value={item.startYear} onChange={(v) => update(i, "startYear", v)} placeholder="YYYY" />
                        </Field>
                        <Field label="End Year">
                            <Input value={item.endYear} onChange={(v) => update(i, "endYear", v)} placeholder="YYYY or Present" />
                        </Field>
                    </div>
                    <Field label="Description (optional)" hint="Mention honors, GPA, or relevant courseworks.">
                        <Textarea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Graduated with honors..." rows={3} />
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
            <SectionHeader
                title="Work Experience"
                description="Highlight your professional journey and achievements."
                action={<AddButton onClick={add} label="Add Role" />}
            />
            {items.length === 0 ? (
                <EmptyState message="No experience entries yet. Add your past roles to show your expertise." onAdd={add} addLabel="Add Experience" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.role ? `${item.role} @ ${item.company || 'Company'}` : "New Role"}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Company / Organization">
                            <Input value={item.company} onChange={(v) => update(i, "company", v)} placeholder="e.g. Google" />
                        </Field>
                        <Field label="Role / Job Title">
                            <Input value={item.role} onChange={(v) => update(i, "role", v)} placeholder="e.g. Senior Software Engineer" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date">
                            <Input value={item.startDate} onChange={(v) => update(i, "startDate", v)} placeholder="e.g. Jan 2023" />
                        </Field>
                        <Field label="End Date">
                            <Input value={item.endDate} onChange={(v) => update(i, "endDate", v)} placeholder="e.g. Dec 2024" disabled={item.current}
                                className={item.current ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </Field>
                    </div>
                    <label className="flex items-center gap-2.5 mb-5 cursor-pointer group w-max">
                        <input type="checkbox" checked={item.current || false} onChange={(e) => update(i, "current", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">I currently work here</span>
                    </label>
                    <Field label="Responsibilities & Impact" hint="Use bullet points or brief paragraphs. Focus on metrics.">
                        <Textarea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="Led development of the core architecture..." rows={4} />
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
            <SectionHeader
                title="Projects"
                description="Showcase your best work. Include links to live demos or repos."
                action={<AddButton onClick={add} label="Add Project" />}
            />
            {items.length === 0 ? (
                <EmptyState message="No projects yet. Add side projects, open-source contributions, or client work." onAdd={add} addLabel="Add Project" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.title || "New Project"}>
                    <Field label="Project Title">
                        <Input value={item.title} onChange={(v) => update(i, "title", v)} placeholder="e.g. E-Commerce Dashboard" />
                    </Field>
                    <Field label="Description">
                        <Textarea value={item.description} onChange={(v) => update(i, "description", v)} placeholder="What does it do? What problem does it solve and what was your role?" rows={3} />
                    </Field>
                    <Field label="Tech Stack" hint="List technologies separated by commas (e.g. React, Node.js, Tailwind)">
                        <Input
                            value={(item.techStack || []).join(", ")}
                            onChange={(v) => update(i, "techStack", v.split(",").map(s => s.trim()).filter(Boolean))}
                            placeholder="React, Node.js, PostgreSQL"
                        />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Live Demo URL">
                            <div className="relative">
                                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input value={item.liveUrl} onChange={(v) => update(i, "liveUrl", v)} placeholder="https://your-project.com" className="pl-10" />
                            </div>
                        </Field>
                        <Field label="GitHub Repository URL">
                            <div className="relative">
                                <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input value={item.githubUrl} onChange={(v) => update(i, "githubUrl", v)} placeholder="https://github.com/username/repo" className="pl-10" />
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
            <SectionHeader
                title="Certificates & Awards"
                description="List notable certifications or honors you've received."
                action={<AddButton onClick={add} label="Add Certificate" />}
            />
            {items.length === 0 ? (
                <EmptyState message="No certificates yet. Add your professional courses and awards." onAdd={add} addLabel="Add Certificate" />
            ) : items.map((item, i) => (
                <ItemCard key={i} onRemove={() => remove(i)} title={item.title || "New Certificate"}>
                    <Field label="Award / Certificate Title">
                        <Input value={item.title} onChange={(v) => update(i, "title", v)} placeholder="e.g. AWS Certified Solutions Architect" />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Issuing Organization">
                            <Input value={item.issuer} onChange={(v) => update(i, "issuer", v)} placeholder="e.g. Amazon Web Services" />
                        </Field>
                        <Field label="Year / Date">
                            <Input value={item.date} onChange={(v) => update(i, "date", v)} placeholder="e.g. Oct 2023" />
                        </Field>
                    </div>
                    <Field label="Credential URL (Optional)">
                        <div className="relative">
                            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input value={item.url} onChange={(v) => update(i, "url", v)} placeholder="https://verify.com/your-badge" className="pl-10" />
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
            <SectionHeader
                title="Contact Details"
                description="Where can people reach out or see more of your work?"
            />
            <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1">
                <Field label="Email Address">
                    <Input value={contact.email} onChange={(v) => upd("email", v)} placeholder="your.email@example.com" type="email" />
                </Field>
                <Field label="Phone Number (Optional)">
                    <Input value={contact.phone} onChange={(v) => upd("phone", v)} placeholder="+1 (555) 000-0000" />
                </Field>
                <Field label="LinkedIn Profile">
                    <Input value={contact.linkedin} onChange={(v) => upd("linkedin", v)} placeholder="https://linkedin.com/in/username" />
                </Field>
                <Field label="GitHub Profile">
                    <Input value={contact.github} onChange={(v) => upd("github", v)} placeholder="https://github.com/username" />
                </Field>
                <Field label="Twitter / X Profile">
                    <Input value={contact.twitter} onChange={(v) => upd("twitter", v)} placeholder="https://twitter.com/username" />
                </Field>
                <Field label="Personal Website">
                    <Input value={contact.website} onChange={(v) => upd("website", v)} placeholder="https://your-domain.com" />
                </Field>
            </div>
        </div>
    );
};

/* ─── AI Generate bar ────────────────────────────────── */
const aiPlaceholders = {
    about: "e.g. 'Write a professional bio for a Senior React dev passionate about UX'",
    skills: "e.g. 'List modern frontend and backend JS skills'",
    education: "e.g. 'B.S. in Computer Science at MIT, graduated 2022'",
    experience: "e.g. 'Expand on: Built scalable APIs using Node.js at Stripe'",
    projects: "e.g. 'Describe a generic e-commerce app built with Next.js and Prisma'",
    certificates: "e.g. 'AWS Practitioner and Meta Frontend dev certs'",
    contact: "e.g. 'Add placeholders for all my contact links'",
};

const AIBar = ({ activeSection, onGenerate, loading }) => {
    const [input, setInput] = useState("");
    const handleSubmit = () => {
        if (!input.trim()) return;
        onGenerate(input);
        setInput("");
    };
    return (
        <div className="mb-8 bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/30 transition-all duration-500"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white tracking-wide">
                        Ask AI to write <span className="text-blue-400 font-semibold">{sections.find(s => s.id === activeSection)?.label}</span>
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                        placeholder={aiPlaceholders[activeSection]}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/15 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10 transition-all"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !input.trim()}
                        className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-slate-900 text-sm font-bold disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center gap-2 transition-all shrink-0"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>Generate</span>
                    </button>
                </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-slate-100"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Publish Portfolio</h2>
                            <p className="text-sm text-slate-500 mt-0.5">Claim your custom subdomain</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Subdomain input */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2.5">
                        Your Subdomain Link
                    </label>
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <input
                                value={subdomain}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder="e.g. john-doe"
                                className="w-full px-4 py-3 rounded-l-xl border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:z-10 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all pr-10"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {checking && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                                {!checking && available === true && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                {!checking && available === false && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-slate-50 border border-l-0 border-slate-200 rounded-r-xl text-sm font-semibold text-slate-500 shrink-0">
                            .myfolio.fun
                        </div>
                    </div>

                    {/* Preview URL */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-xs">{subdomain || "your-name"}.myfolio.fun</span>
                    </div>

                    {/* Availability feedback */}
                    <div className="h-6 mt-2">
                        <AnimatePresence>
                            {!checking && available !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className={`flex items-center gap-1.5 text-xs font-semibold ${available ? "text-green-600" : "text-red-500"}`}
                                >
                                    {available ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                    {isExisting ? "This is your current subdomain" : available ? "Great! This subdomain is available." : "This subdomain is already taken."}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Publish button */}
                <button
                    onClick={() => onPublish(subdomain)}
                    disabled={(!available && !isExisting) || publishing || !subdomain.trim()}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:hover:bg-slate-900 flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-200"
                >
                    {publishing
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Launching Site…</>
                        : <><Globe className="w-4 h-4" /> {isExisting ? "Update Domain" : "Publish to Internet"}</>
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
    const location = useLocation();
    const { user } = useAuth();
    const { toasts, add: toast, remove: removeToast } = useToast();

    const [portfolio, setPortfolio] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedIndicator, setSavedIndicator] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [publishModal, setPublishModal] = useState(false);
    const [publishing, setPublishing] = useState(false);

    // Parse initial section from URL hash
    const hashStr = location.hash.replace("#", "");
    const initialSection = sections.some(s => s.id === hashStr) ? hashStr : "about";
    const [activeSection, setActiveSection] = useState(initialSection);

    const [isDirty, setIsDirty] = useState(false);

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

    // Update URL Hash when section changes to allow deep-linking
    useEffect(() => {
        window.history.replaceState(null, "", `#${activeSection}`);
    }, [activeSection]);

    const updateData = (field, value) => {
        const newData = { ...portfolio.data, [field]: value };
        setPortfolio({ ...portfolio, data: newData });
        setIsDirty(true);
    };

    const handleManualSave = async () => {
        if (!isDirty) return;
        try {
            setSaving(true);
            await portfolioAPI.update(id, portfolio.data);
            setIsDirty(false);
            setSavedIndicator(true);
            setTimeout(() => setSavedIndicator(false), 2000);
            toast("Portfolio saved successfully!", "success");
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
                toast("AI successfully crafted your content!", "success");
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
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
                    <p className="text-sm font-medium text-slate-500">Preparing Editor…</p>
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
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            {/* ── Top Bar ──────────────────────────────────── */}
            <header className="shrink-0 bg-white border-b border-slate-200 z-40 relative">
                <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 shrink-0"
                            title="Back to Dashboard"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-0 flex flex-col justify-center">
                            <h1 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight">
                                {portfolio.data?.name || "Portfolio"}
                            </h1>
                            <div className="flex items-center h-4 mt-0.5">
                                {saving ? (
                                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Saving changes...
                                    </span>
                                ) : savedIndicator ? (
                                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600">
                                        <Check className="w-3 h-3" /> Saved to cloud
                                    </span>
                                ) : isDirty ? (
                                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-500">
                                        <AlertCircle className="w-3 h-3" /> Unsaved changes
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-medium text-slate-400">All changes saved</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Preview toggle (mobile only) */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all lg:hidden shadow-sm"
                            title={showPreview ? "Edit Mode" : "Live Preview"}
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="hidden sm:inline sm:ml-2">{showPreview ? "Edit Mode" : "Preview"}</span>
                        </button>

                        {/* Manual save */}
                        <button
                            onClick={handleManualSave}
                            disabled={saving || !isDirty}
                            className={`hidden sm:flex items-center justify-center px-4 py-2 rounded-xl border text-sm font-semibold transition-all shadow-sm ${isDirty
                                ? "bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200 focus:ring-4 focus:ring-amber-50"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                        >
                            <Save className="w-4 h-4 mr-2" /> {isDirty ? "Save Changes" : "Saved"}
                        </button>

                        {/* Publish / View Live */}
                        {portfolio.status !== "published" ? (
                            <button
                                onClick={() => setPublishModal(true)}
                                className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-sm focus:ring-4 focus:ring-slate-200"
                            >
                                <Globe className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Publish</span>
                            </button>
                        ) : (
                            <a
                                href={`https://${portfolio.subdomain}.myfolio.fun`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors shadow-sm"
                            >
                                <ExternalLink className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">View Live</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Layout ───────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Sidebar Setup Navigation */}
                <aside className={`shrink-0 w-20 sm:w-64 bg-white border-r border-slate-200 overflow-y-auto ${showPreview ? "hidden lg:flex" : "flex"} flex-col z-20`}>
                    <div className="p-4 hidden sm:block border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Builder Steps</span>
                    </div>
                    <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto pb-24 lg:pb-3">
                        {sections.map((sec) => {
                            const Icon = sec.icon;
                            const isActive = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => { setActiveSection(sec.id); setShowPreview(false); }}
                                    className={`w-full flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl text-sm font-bold transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-slate-400
                                        ${isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                                    <span className="hidden sm:block">{sec.label}</span>
                                    {/* Unread dot simulation just for decoration */}
                                    {!isActive && sec.id === "projects" && (
                                        <span className="hidden sm:block absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Editor main panel */}
                <main className={`flex-1 overflow-y-auto bg-slate-50 relative ${showPreview ? "hidden lg:block" : "block"}`}>
                    <div className="max-w-3xl mx-auto p-4 sm:p-8 lg:p-10 pb-32">

                        {/* Page Header Title */}
                        <div className="mb-6 hidden sm:block">
                            <h1 className="text-2xl font-black text-slate-900">
                                {sections.find(s => s.id === activeSection)?.label}
                            </h1>
                        </div>

                        {/* AI Gen Magic Bar */}
                        <AIBar
                            activeSection={activeSection}
                            onGenerate={handleAIGenerate}
                            loading={aiLoading}
                        />

                        {/* Section Content */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
                                >
                                    {renderSection()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* Live Preview panel */}
                <aside className={`w-full lg:w-[45%] xl:w-[42%] border-l border-slate-200 bg-slate-100 overflow-hidden flex flex-col absolute inset-0 z-30 lg:relative ${showPreview ? "flex" : "hidden lg:flex"}`}>
                    <div className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between shrink-0 shadow-sm z-10">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Eye className="w-4 h-4 text-slate-400" />
                            Live Preview
                        </span>
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Syncing</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-full origin-top relative ring-1 ring-black/5">
                            <LivePreview
                                data={portfolio.data}
                                templateId={portfolio.templateId}
                                templateSlug={portfolio.templateSlug}
                            />
                        </div>
                    </div>
                </aside>
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
