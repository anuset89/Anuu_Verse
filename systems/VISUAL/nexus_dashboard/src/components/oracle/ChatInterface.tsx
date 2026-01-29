import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import TextareaAutosize from 'react-textarea-autosize';
import 'highlight.js/styles/atom-one-dark.css';

// Types
interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

const TypingMessage = ({ content, onComplete }: { content: string, onComplete?: () => void }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < content.length) {
                setDisplayed(prev => prev + content.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 5);
        return () => clearInterval(interval);
    }, [content, onComplete]);

    return (
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#111] prose-pre:p-4 prose-pre:rounded-xl prose-sm max-w-none break-words">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {displayed}
            </ReactMarkdown>
        </div>
    );
};

interface ChatInterfaceProps {
    activeMode?: 'chat' | 'image' | 'video';
    onModeChange?: (mode: 'chat' | 'image' | 'video') => void;
}

export const ChatInterface = ({ activeMode, onModeChange }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', role: 'system', content: 'Anuu System Online.', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [deepThink, setDeepThink] = useState(false);
    const [internalMode, setInternalMode] = useState<'chat' | 'image' | 'video'>('chat');

    // Derived state: Use prop if available, else internal
    const generationMode = activeMode || internalMode;
    const setGenerationMode = (mode: 'chat' | 'image' | 'video') => {
        if (onModeChange) onModeChange(mode);
        setInternalMode(mode);
    };

    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Determine UI Color based on mode
    const getModeColor = () => {
        if (generationMode === 'image') return 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)] bg-pink-950/10';
        if (generationMode === 'video') return 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)] bg-orange-950/10';
        return 'border-white/10 bg-[#202020]';
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            let response;
            let data;

            // Route based on Mode
            if (generationMode === 'image') {
                response = await fetch('http://localhost:8000/vision/dream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userMsg.content })
                });
            } else if (generationMode === 'video') {
                response = await fetch('http://localhost:8000/vision/hallucinate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userMsg.content })
                });
            } else {
                // Standard Chat
                response = await fetch('http://localhost:8000/mind/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: userMsg.content,
                        user_id: 'kali_prime',
                        stream: false,
                        deep_think: deepThink
                    })
                });
            }

            data = await response.json();

            // Format Bot Message based on response type
            let botContent = data.reply || data.message || "Connection to Mind severed.";

            // If image/video, add markdown image/video placeholder
            if (data.type === 'image') botContent = `Generating Image: **${userMsg.content}**...\n\n*(Visualizing in Flux Realm)*`;
            if (data.type === 'video') botContent = `Rendering Video: **${userMsg.content}**...\n\n*(Hallucinating in Video Realm)*`;

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: botContent,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                content: `Error: ${error}`,
                timestamp: Date.now()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const [showMenu, setShowMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInput(`[Attached: ${e.target.files[0].name}] Analyze this file...`);
            setShowMenu(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent w-full relative">

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-8 space-y-8 custom-scrollbar scroll-smooth"
            >
                <div className="w-full max-w-3xl mx-auto space-y-8 pb-32">
                    <AnimatePresence>
                        {/* Welcome / Empty State */}
                        {messages.length <= 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">Hola, Kali.</h2>
                                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                                        ¿En qué puedo ayudarte hoy? Selecciona una opción o escribe abajo.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                                    <button
                                        onClick={() => { setGenerationMode('chat'); setInput("Investiga sobre: Últimas tendencias en IA 2025"); }}
                                        className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-cyan-500/50 hover:bg-[#222] transition-all group text-left"
                                    >
                                        <div className="text-2xl mb-2">🔍</div>
                                        <h3 className="font-semibold text-white group-hover:text-cyan-400">Investigar un Tema</h3>
                                        <p className="text-sm text-gray-500 mt-1">Lanza al Erudito para buscar en la web.</p>
                                    </button>

                                    <button
                                        onClick={() => { setGenerationMode('chat'); setDeepThink(true); setInput("Explícame cómo funciona la computación cuántica"); }}
                                        className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-purple-500/50 hover:bg-[#222] transition-all group text-left"
                                    >
                                        <div className="text-2xl mb-2">🧠</div>
                                        <h3 className="font-semibold text-white group-hover:text-purple-400">Razonamiento Profundo</h3>
                                        <p className="text-sm text-gray-500 mt-1">Análisis complejo y paso a paso.</p>
                                    </button>

                                    <button
                                        onClick={() => { setGenerationMode('video'); }}
                                        className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-orange-500/50 hover:bg-[#222] transition-all group text-left"
                                    >
                                        <div className="text-2xl mb-2">🎥</div>
                                        <h3 className="font-semibold text-white group-hover:text-orange-400">Generar Video</h3>
                                        <p className="text-sm text-gray-500 mt-1">Crear clips de video con IA.</p>
                                    </button>

                                    <button
                                        onClick={() => { setGenerationMode('image'); }}
                                        className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-pink-500/50 hover:bg-[#222] transition-all group text-left"
                                    >
                                        <div className="text-2xl mb-2">🎨</div>
                                        <h3 className="font-semibold text-white group-hover:text-pink-400">Crear Imagen (Flux)</h3>
                                        <p className="text-sm text-gray-500 mt-1">Visualizar conceptos artísticos.</p>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {messages.slice(1).map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-1 shadow-[0_0_10px_rgba(168,85,247,0.5)]">A</div>
                                )}

                                <div
                                    className={`group relative max-w-[85%] rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed font-sans ${msg.role === 'user'
                                        ? 'bg-[#222] text-gray-100'
                                        : 'text-gray-300'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    ) : (
                                        <>
                                            <div className="text-[10px] uppercase text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-0">ANUU v0.21</div>
                                            {idx === messages.length - 1 && !loading ? (
                                                <TypingMessage content={msg.content} />
                                            ) : (
                                                <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#111] prose-pre:p-4 prose-pre:rounded-xl">
                                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-1 shadow-[0_0_10px_rgba(168,85,247,0.5)]">A</div>
                            <div className="flex items-center gap-1 mt-3">
                                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-100"></span>
                                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-200"></span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom Input Area */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-20 pointer-events-none">
                <div className="w-full max-w-3xl mx-auto relative pointer-events-auto">

                    {/* Mode Indicator Pill */}
                    {generationMode !== 'chat' && (
                        <div className="absolute -top-10 left-0 flex gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${generationMode === 'image' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                                {generationMode === 'image' ? '🎨 FLUX IMAGE' : '🎥 VIDEO GEN'}
                                <button onClick={() => setGenerationMode('chat')} className="hover:text-white ml-1">✕</button>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute bottom-16 left-0 bg-[#151515] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[200px] z-50 backdrop-blur-xl"
                            >
                                <div className="p-1 space-y-0.5">
                                    <button
                                        onClick={() => { setGenerationMode('video'); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-left"
                                    >
                                        <span className="text-lg">🎥</span> Generate Video
                                    </button>
                                    <button
                                        onClick={() => { setGenerationMode('image'); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-left"
                                    >
                                        <span className="text-lg">🎨</span> Generate Image
                                    </button>
                                    <button
                                        onClick={() => { setInput("Ejecuta un escaneo de seguridad en localhost"); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-left"
                                    >
                                        <span className="text-lg">🛡️</span> Security Scan
                                    </button>
                                    <div className="h-px bg-white/10 my-1" />
                                    <button
                                        onClick={() => { setMessages([{ id: '0', role: 'system', content: 'Anuu System Online.', timestamp: Date.now() }]); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left"
                                    >
                                        <span className="text-lg">🧹</span> Clear Chat
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={`rounded-[26px] p-2 border relative group focus-within:border-opacity-100 transition-all flex items-end gap-2 shadow-sm ${getModeColor()}`}>

                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className={`p-2 rounded-full transition-all mb-0.5 ${showMenu ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            <svg className={`w-5 h-5 transition-transform duration-300 ${showMenu ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>

                        <button
                            onClick={() => setDeepThink(!deepThink)}
                            className={`p-2 rounded-full transition-all mb-0.5 ${deepThink ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Deep Think (Reasoning Mode)"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </button>

                        <TextareaAutosize
                            minRows={1}
                            maxRows={8}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={generationMode === 'image' ? "Describe the image to generate..." : generationMode === 'video' ? "Describe the video scene..." : "Message Anuu..."}
                            className={`flex-1 bg-transparent border-none focus:ring-0 resize-none text-white placeholder-gray-500 text-base max-h-[200px] overflow-y-auto px-2 py-2 mb-0.5 custom-scrollbar focus:outline-none`}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="p-2 rounded-full bg-white text-black hover:bg-cyan-400 disabled:opacity-20 disabled:hover:bg-white transition-all mb-0.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    <div className="text-center mt-2 text-[10px] text-gray-600 font-mono">
                        Anuu 0.21 | Sovereign Research | {generationMode.toUpperCase()} MODE
                    </div>
                </div>
            </div>
        </div>
    );
};
