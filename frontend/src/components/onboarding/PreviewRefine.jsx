import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, Eye, MessageCircle, Palette, Check, Loader2 } from "lucide-react";
import { aiAPI } from "../../services/api";
import LivePreview from "../editor/LivePreview";

const PreviewRefine = ({
    portfolioId,
    portfolioData,
    templateId,
    templateSlug,
    refineSessionId,
    onSessionId,
    onDataUpdate,
    onPublish,
    onChangeTemplate,
}) => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Here's your portfolio preview! 🎉 Take a look and let me know if you'd like to change anything — about section, project descriptions, skills, or any other content. When you're happy with it, hit Publish!",
        },
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [sessionId, setSessionId] = useState(refineSessionId);
    const [mobileView, setMobileView] = useState("preview"); // preview | chat
    const [localData, setLocalData] = useState(portfolioData);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        console.log("HIII", templateSlug)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    useEffect(() => {
        setLocalData(portfolioData);
    }, [portfolioData]);

    const sendMessage = async (userMessage) => {
        if (!userMessage?.trim()) return;
        setSending(true);
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

        try {
            const res = await aiAPI.refine(portfolioId, userMessage, sessionId);
            const { sessionId: sid, message, portfolioData: newData, updated } = res.data.data;

            if (!sessionId) {
                setSessionId(sid);
                onSessionId(sid);
            }

            setMessages((prev) => [...prev, { role: "assistant", content: message }]);

            if (updated && newData) {
                setLocalData(newData);
                onDataUpdate(newData);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Something went wrong. Please try again! 😅" },
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

    // Chat panel content
    const ChatPanel = () => (
        <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Folio AI</h3>
                    <p className="text-xs text-slate-400">Ask me to edit any content</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onChangeTemplate}
                        className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                        <Palette className="w-3 h-3" /> Change Template
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
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
            <div className="p-3 border-t border-slate-100">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={sending}
                        placeholder="e.g., Make my about section more professional..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:border-blue-400 focus:outline-none disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>

                {/* Publish button */}
                <button
                    onClick={onPublish}
                    className="w-full mt-3 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                    <Check className="w-4 h-4" /> I'm satisfied — Publish!
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop: side-by-side */}
            <div className="hidden md:flex h-screen">
                {/* Chat side */}
                <div className="w-[380px] bg-white border-r border-slate-200 flex flex-col">
                    <ChatPanel />
                </div>

                {/* Preview side */}
                <div className="flex-1 bg-slate-100 overflow-auto">
                    <div className="max-w-4xl mx-auto py-6 px-4">
                        <LivePreview data={localData} templateId={templateId} templateSlug={templateSlug} />
                    </div>
                </div>
            </div>

            {/* Mobile: toggle between chat and preview */}
            <div className="md:hidden h-screen flex flex-col">
                {/* Toggle bar */}
                <div className="flex bg-white border-b border-slate-200">
                    <button
                        onClick={() => setMobileView("preview")}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileView === "preview"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-slate-400"
                            }`}
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button
                        onClick={() => setMobileView("chat")}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileView === "chat"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-slate-400"
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" /> Chat
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {mobileView === "preview" ? (
                        <div className="h-full overflow-auto bg-slate-100 p-3">
                            <LivePreview data={localData} templateId={templateId} templateSlug={templateSlug} />
                        </div>
                    ) : (
                        <div className="h-full bg-white flex flex-col">
                            <ChatPanel />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PreviewRefine;
