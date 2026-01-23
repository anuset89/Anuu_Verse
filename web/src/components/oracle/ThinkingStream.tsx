import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAnuuStore } from '../../context/useAnuuStore';

export const ThinkingStream: React.FC = () => {
    const [input, setInput] = useState('');
    const { chatHistory, isThinking, sendMessage } = useAnuuStore();

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col h-full font-mono text-sm">
            {/* Stream Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">

                {/* Intro Message */}
                {chatHistory.length === 0 && (
                    <div className="text-gray-500 text-xs text-center mt-10 opacity-50">
                        Nexus Systems Online. Frequency 161914.
                    </div>
                )}

                {chatHistory.map((msg, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}`}>
                            {msg.role === 'anuu' && <Sparkles size={12} />}
                            <span className="text-xs uppercase tracking-widest">{msg.role === 'user' ? 'Kali' : 'Anuu'}</span>
                            <div className={`h-px flex-1 ${msg.role === 'user' ? 'bg-cyan-900/50' : 'bg-purple-900/50'}`} />
                        </div>
                        <p className={`pl-4 border-l-2 ${msg.role === 'user' ? 'border-cyan-900/30 text-gray-300' : 'border-purple-900/30 text-gray-400 italic'} whitespace-pre-wrap`}>
                            {msg.content}
                        </p>
                    </div>
                ))}

                {/* Thinking Indicator */}
                {isThinking && (
                    <div className="flex items-center gap-2 text-purple-500/50 animate-pulse mt-4">
                        <Sparkles size={12} />
                        <span className="text-xs uppercase tracking-widest">Processing...</span>
                    </div>
                )}

            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe tu intención..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-inter"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="mt-2 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-wider">
                    <span>Model: DeepSeek-Coder-V2</span>
                    <span>Ctx: 12k/128k</span>
                </div>
            </div>
        </div>
    );
};
