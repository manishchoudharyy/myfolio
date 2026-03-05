import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Eye, MessageCircle, Palette, Check,
    Loader2, Bot, User, Sparkles, ExternalLink, Wand2,
} from "lucide-react";
import { aiAPI } from "../../services/api";
import LivePreview from "../editor/LivePreview";

const QUICK_PROMPTS = [
    "Make my about section more professional",
    "Improve project descriptions",
    "Rewrite skills section",
    "Make experience more impactful",
];

/* ═══════════════════════════════════════════════════════════════
   PreviewWrapper — contains the template inside the panel.
   overflow-x hidden clips any horizontal bleed,
   the parent panel handles vertical scroll.
═══════════════════════════════════════════════════════════════ */
const PreviewWrapper = memo(({ data, templateId, templateSlug }) => (
    <div className="w-full overflow-x-hidden">
        <LivePreview data={data} templateId={templateId} templateSlug={templateSlug} />
    </div>
));

/* ═══════════════════════════════════════════════════════════════
   ChatContent — extracted OUTSIDE PreviewRefine so it is NOT
   redefined on every keystroke → no remount on input change.
   Wrapped in memo() so it only re-renders when props change.
═══════════════════════════════════════════════════════════════ */
const ChatContent = memo(({
    messages, input, setInput, sending, updated,
    messagesEndRef, inputRef,
    onSubmit, onQuickPrompt, onChangeTemplate, onPublish,
    isExistingPortfolio,
}) => (
    <div className="flex flex-col h-full">

        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Folio AI</p>
                <p className="text-[11px] text-slate-400">Ask me to edit any content</p>
            </div>
            <button
                onClick={onChangeTemplate}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
            >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Template</span>
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user"
                            ? "bg-slate-100 border border-slate-200"
                            : "bg-slate-900"
                            }`}>
                            {msg.role === "user"
                                ? <User className="w-4 h-4 text-slate-600" />
                                : <Bot className="w-4 h-4 text-white" />
                            }
                        </div>
                        <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                            ? "bg-slate-900 text-white rounded-br-sm"
                            : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
                            }`}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {sending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm">
                        <div className="flex gap-1.5">
                            {[0, 150, 300].map((d) => (
                                <div key={d} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Updated toast */}
            <AnimatePresence>
                {updated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                            <Check className="w-3.5 h-3.5" /> Portfolio updated!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 pb-2 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
                {QUICK_PROMPTS.map((p) => (
                    <button
                        key={p}
                        onClick={() => onQuickPrompt(p)}
                        disabled={sending}
                        className="text-[11px] text-slate-600 font-medium bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors disabled:opacity-40"
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 shrink-0 space-y-3 border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <form onSubmit={onSubmit} className="flex items-center gap-2.5">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sending}
                    placeholder="e.g., Make my about more professional..."
                    className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white rounded-xl text-sm border border-slate-200 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 focus:ring-4 focus:ring-slate-200"
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                </button>
            </form>

            <button
                onClick={onPublish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all focus:ring-4 focus:ring-slate-200 ${isExistingPortfolio
                    ? "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-md transform hover:-translate-y-0.5"
                    }`}
            >
                {isExistingPortfolio ? (
                    <>
                        <Check className="w-4 h-4" /> Done Editing
                    </>
                ) : (
                    <>
                        <Check className="w-4 h-4" /> Publish Portfolio
                    </>
                )}
            </button>
        </div>
    </div>
));

/* ═══════════════════════════════════════════════════════════════
   PreviewRefine — main component
═══════════════════════════════════════════════════════════════ */
const PreviewRefine = ({
    portfolioId, portfolioData, templateId, templateSlug,
    refineSessionId, onSessionId, onDataUpdate, onPublish, onChangeTemplate,
    isExistingPortfolio,
}) => {
    const [messages, setMessages] = useState([{
        role: "assistant",
        content: "🎉 Your portfolio is ready! Take a look on the right. Want to change anything? Just ask me — I can update any section, improve your writing, or tweak the content.",
    }]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [sessionId, setSessionId] = useState(refineSessionId);
    const [mobileTab, setMobileTab] = useState("preview");
    const [localData, setLocalData] = useState(portfolioData);
    const [updated, setUpdated] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    useEffect(() => { setLocalData(portfolioData); }, [portfolioData]);

    const sendMessage = async (text) => {
        const userMessage = (text || input).trim();
        if (!userMessage) return;
        setInput("");
        setSending(true);
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        try {
            const res = await aiAPI.refine(portfolioId, userMessage, sessionId);
            const { sessionId: sid, message, portfolioData: newData, updated: wasUpdated } = res.data.data;
            if (!sessionId) { setSessionId(sid); onSessionId(sid); }
            setMessages((prev) => [...prev, { role: "assistant", content: message }]);
            if (wasUpdated && newData) {
                setLocalData(newData);
                onDataUpdate(newData);
                setUpdated(true);
                setTimeout(() => setUpdated(false), 3000);
            }
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again! 😅" }]);
        } finally {
            setSending(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;
        sendMessage(input);
    };

    // Props passed down to ChatContent (memo'd — only re-renders when these change)
    const chatProps = {
        messages, input, setInput, sending, updated,
        messagesEndRef, inputRef,
        onSubmit: handleSubmit,
        onQuickPrompt: sendMessage,
        onChangeTemplate,
        onPublish,
        isExistingPortfolio,
    };

    return (
        <>
            {/* ══ DESKTOP: side-by-side ══════════════════════════════ */}
            <div className="hidden md:flex h-full">

                {/* Chat panel */}
                <div className="w-[360px] shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                    <ChatContent {...chatProps} />
                </div>

                {/* Preview panel */}
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
                    {/* Fake browser chrome */}
                    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-3 bg-slate-100 rounded-md px-3 py-1 text-xs text-slate-400 font-mono truncate">
                            yourname.myfolio.fun
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <ExternalLink className="w-3 h-3" /> Live preview
                        </div>
                    </div>

                    {/* Scrollable preview */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <PreviewWrapper data={localData} templateId={templateId} templateSlug={templateSlug} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ MOBILE: tabbed ════════════════════════════════════ */}
            <div className="md:hidden flex flex-col h-full">
                {/* Tabs */}
                <div className="bg-white border-b border-slate-200 flex shrink-0">
                    {[
                        { id: "preview", icon: Eye, label: "Preview" },
                        { id: "chat", icon: Sparkles, label: "Edit with AI" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setMobileTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold border-b-2 transition-colors ${mobileTab === tab.id
                                ? "text-slate-900 border-slate-900"
                                : "text-slate-400 border-transparent hover:text-slate-600"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {mobileTab === "preview" ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full overflow-y-auto overflow-x-hidden bg-slate-100 p-3"
                            >
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <PreviewWrapper data={localData} templateId={templateId} templateSlug={templateSlug} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full bg-white flex flex-col overflow-hidden"
                            >
                                <ChatContent {...chatProps} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default PreviewRefine;
