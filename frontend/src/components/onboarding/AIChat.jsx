import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, CheckCircle2, Circle, Sparkles, Bot, User } from "lucide-react";
import { aiAPI } from "../../services/api";

const SECTIONS = [
    { key: "name", label: "Name", emoji: "👤" },
    { key: "title", label: "Title", emoji: "💼" },
    { key: "about", label: "About", emoji: "📝" },
    { key: "experience", label: "Experience", emoji: "🏢" },
    { key: "education", label: "Education", emoji: "🎓" },
    { key: "projects", label: "Projects", emoji: "🚀" },
    { key: "skills", label: "Skills", emoji: "⚡" },
    { key: "contact", label: "Contact", emoji: "📬" },
];

const AIChat = ({ sessionId, collectedData, onSessionId, onDataUpdate, onComplete }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(sessionId);
    const [localData, setLocalData] = useState(collectedData || {});
    const [initialized, setInitialized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!initialized) { initChat(); setInitialized(true); }
    }, []);

    const initChat = async () => {
        if (sessionId) {
            try {
                const res = await aiAPI.getSession();
                if (res.data.data) {
                    const { messages: saved, collectedData: savedData } = res.data.data;
                    setMessages(saved.map((m) => ({ role: m.role, content: m.content })));
                    setLocalData(savedData || {});
                    onDataUpdate(savedData || {});
                    return;
                }
            } catch { /* start fresh */ }
        }
        sendMessage(null);
    };

    const sendMessage = async (userMessage) => {
        setSending(true);
        if (userMessage) {
            setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        }
        try {
            const res = await aiAPI.onboard(userMessage, currentSessionId);
            const { sessionId: sid, message, collectedData: newData, isComplete } = res.data.data;
            if (!currentSessionId) { setCurrentSessionId(sid); onSessionId(sid); }
            setMessages((prev) => [...prev, { role: "assistant", content: message }]);
            if (newData) { setLocalData(newData); onDataUpdate(newData); }
            if (isComplete) setTimeout(() => onComplete(newData), 1500);
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", content: "Oops, something went wrong. Please try again! 😅" }]);
        } finally {
            setSending(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;
        const msg = input.trim();
        setInput("");
        sendMessage(msg);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    const isSectionDone = (key) => {
        const d = localData;
        if (key === "name") return !!d.name;
        if (key === "title") return !!d.title;
        if (key === "about") return !!d.about;
        if (key === "skills") return d.skills?.length > 0;
        if (key === "experience") return d.experience?.length > 0;
        if (key === "education") return d.education?.length > 0;
        if (key === "projects") return d.projects?.length > 0;
        if (key === "contact") return d.contact && (d.contact.email || d.contact.phone || d.contact.linkedin || d.contact.github);
        return false;
    };

    const doneCount = SECTIONS.filter((s) => isSectionDone(s.key)).length;
    const progressPct = Math.round((doneCount / SECTIONS.length) * 100);

    return (
        <div className="flex h-[calc(100vh-56px)]">

            {/* ─── Sidebar — desktop only ──────────────────────── */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
                {/* Header */}
                <div className="px-5 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Folio AI</p>
                            <p className="text-[11px] font-medium text-slate-500">Building your portfolio</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                            <span className="text-[11px] font-bold text-slate-900">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-slate-900 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">{doneCount} of {SECTIONS.length} sections</p>
                    </div>
                </div>

                {/* Sections list */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                    {SECTIONS.map((s) => {
                        const done = isSectionDone(s.key);
                        return (
                            <div
                                key={s.key}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${done ? "bg-green-50" : "bg-transparent"}`}
                            >
                                <span className="text-base">{s.emoji}</span>
                                <span className={`text-sm flex-1 ${done ? "text-green-800 font-medium" : "text-slate-400"}`}>
                                    {s.label}
                                </span>
                                {done ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                ) : (
                                    <Circle className="w-4 h-4 text-slate-200 shrink-0" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* ─── Chat area ───────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-slate-50 min-w-0">

                {/* Chat top bar */}
                <div className="bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4 shrink-0 shadow-sm z-10">
                    <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900">Folio AI</p>
                        <p className="text-[11px] font-medium text-slate-500 truncate">Collecting your portfolio details</p>
                    </div>
                    {/* Mobile progress pill */}
                    <div className="lg:hidden flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden">
                            <div
                                className="h-full bg-slate-900 rounded-full transition-all"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-bold text-slate-900">{progressPct}%</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user"
                                    ? "bg-slate-100 border border-slate-200"
                                    : "bg-slate-900"
                                    }`}>
                                    {msg.role === "user"
                                        ? <User className="w-4 h-4 text-slate-600" />
                                        : <Bot className="w-4 h-4 text-white" />
                                    }
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-slate-900 text-white rounded-br-sm"
                                    : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
                                    }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {sending && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-end gap-2.5"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm">
                                <div className="flex gap-1.5">
                                    {[0, 150, 300].map((delay) => (
                                        <div
                                            key={delay}
                                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${delay}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input bar */}
                <div className="bg-white border-t border-slate-200 px-4 py-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={sending}
                            placeholder="Type your message..."
                            className="flex-1 px-5 py-3.5 bg-slate-50 focus:bg-white rounded-xl text-sm border border-slate-200 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 focus:outline-none transition-all disabled:opacity-50 shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || sending}
                            className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm hover:-translate-y-0.5 focus:ring-4 focus:ring-slate-200"
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
