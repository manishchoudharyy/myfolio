import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, Loader2, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { aiAPI } from "../../services/api";

const SECTIONS = [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "about", label: "About" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
    { key: "contact", label: "Contact" },
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

    // Initialize chat — either resume session or start fresh
    useEffect(() => {
        if (!initialized) {
            initChat();
            setInitialized(true);
        }
    }, []);

    const initChat = async () => {
        if (sessionId) {
            // Resume existing session
            try {
                const res = await aiAPI.getSession();
                if (res.data.data) {
                    const { messages: savedMessages, collectedData: savedData } = res.data.data;
                    setMessages(
                        savedMessages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        }))
                    );
                    setLocalData(savedData || {});
                    onDataUpdate(savedData || {});
                    return;
                }
            } catch {
                // Start fresh if resume fails
            }
        }

        // Start fresh conversation
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

            if (!currentSessionId) {
                setCurrentSessionId(sid);
                onSessionId(sid);
            }

            setMessages((prev) => [...prev, { role: "assistant", content: message }]);

            if (newData) {
                setLocalData(newData);
                onDataUpdate(newData);
            }

            if (isComplete) {
                setTimeout(() => onComplete(newData), 1500);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops, something went wrong. Please try again! 😅" },
            ]);
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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    // Progress calculation
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col" style={{ height: "calc(100vh - 60px)" }}>
            <div className="flex gap-4 flex-1 min-h-0">
                {/* Progress sidebar — desktop only */}
                <div className="hidden md:block w-48 shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-slate-900">Progress</span>
                            <span className="ml-auto text-xs text-slate-400">{doneCount}/{SECTIONS.length}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${(doneCount / SECTIONS.length) * 100}%` }}
                            />
                        </div>
                        <div className="space-y-2">
                            {SECTIONS.map((s) => (
                                <div key={s.key} className="flex items-center gap-2">
                                    {isSectionDone(s.key) ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-slate-300" />
                                    )}
                                    <span className={`text-xs ${isSectionDone(s.key) ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {/* Mobile progress bar */}
                    <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500">Progress</span>
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${(doneCount / SECTIONS.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-blue-600">{doneCount}/{SECTIONS.length}</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-slate-100 text-slate-800 rounded-bl-md"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={sending}
                                placeholder="Type your answer..."
                                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || sending}
                                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
