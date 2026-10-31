import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bot, X, Send, Sparkles, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';

const QUICK_PROMPTS = [
    "Find morning flights from Delhi to Mumbai",
    "What is the checked baggage allowance?",
    "How does the overbooking compensation work?",
    "Tell me about web check-in requirements"
];

export default function AiCopilotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am your **Air Flow Buddy & Nexus Travel Copilot**. How can I assist your journey today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (customPrompt) => {
        const text = (customPrompt || input).trim();
        if (!text || loading) return;

        const userMsg = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        if (!customPrompt) setInput('');
        setLoading(true);

        try {
            const res = await api.post('/v1/ai/assistant', {
                message: text,
                user_id: user?.id || null
            });

            const replyContent = res.data?.reply || "I couldn't process that request at the moment.";
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: replyContent,
                    intent: res.data?.intent,
                    flights: res.data?.flights
                }
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '⚠️ Our AI intelligence engine is momentarily reconnecting. You can search verified flights directly in the flight catalog.',
                    isError: true
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-3.5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 group"
                >
                    <span className="p-1.5 bg-slate-950/20 rounded-full">
                        <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
                    </span>
                    <span className="text-sm font-extrabold tracking-wide text-slate-950">Air Flow Buddy</span>
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                </button>
            )}

            {isOpen && (
                <div className="w-[380px] sm:w-[420px] h-[580px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                <Bot className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    Air Flow Buddy <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">AI 3.0</span>
                                </h3>
                                <p className="text-[11px] text-slate-400">Grounded in authoritative flight data</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        m.role === 'user'
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium'
                                            : m.isError
                                            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                                            : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
                                    }`}
                                >
                                    <div className="whitespace-pre-line">{m.content}</div>

                                    {/* Render mini flight results if returned */}
                                    {m.flights && m.flights.length > 0 && (
                                        <div className="mt-3 space-y-2 border-t border-slate-700/60 pt-2">
                                            <p className="text-xs font-semibold text-cyan-400">Verified Scheduled Flights:</p>
                                            {m.flights.map((f, i) => (
                                                <div key={i} className="bg-slate-950/60 p-2 rounded-xl text-xs flex justify-between items-center border border-slate-800">
                                                    <div>
                                                        <div className="font-bold text-white">{f.flightName || f.flightNumber}</div>
                                                        <div className="text-[11px] text-slate-400">{f.origin} → {f.destination}</div>
                                                    </div>
                                                    <div className="font-bold text-emerald-400">${f.price || 4850}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-800/40 rounded-xl w-fit">
                                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                <span>Air Flow Buddy is thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestion pills */}
                    <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex gap-2 overflow-x-auto no-scrollbar">
                        {QUICK_PROMPTS.map((qp, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(qp)}
                                className="whitespace-nowrap text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50 transition-all hover:border-cyan-500/40"
                            >
                                {qp}
                            </button>
                        ))}
                    </div>

                    {/* Input Footer */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="p-3 bg-slate-800/60 border-t border-slate-700/60 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Air Flow Buddy anything..."
                            className="flex-1 bg-slate-950/80 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 p-2.5 rounded-xl transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
