
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../../context/SystemContext';
import { useState } from 'react';
import { clsx } from "clsx";

export function NeuralMatrix() {
    const { identities, loading } = useSystem();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (loading) return <div className="text-neon-cyan animate-pulse">Initializing Neural Link...</div>;

    const activeIdentity = selectedId ? identities.find(id => id.titulo === selectedId) : null;

    return (
        <div className="w-full relative min-h-[600px] bg-[#050510] rounded-xl border border-white/5 overflow-hidden p-8">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            {/* Network Graph Visualizer (Simplified for React) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* List of Identities (Nodes) */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-xl font-display font-bold text-white/50 mb-6">IDENTITY NODES</h3>
                    <div className="space-y-2">
                        {identities.map((identity) => (
                            <motion.button
                                key={identity.titulo}
                                layoutId={`node-${identity.titulo}`}
                                onClick={() => setSelectedId(identity.titulo)}
                                className={clsx(
                                    "w-full text-left p-4 rounded-lg border transition-all duration-300 relative group overflow-hidden",
                                    selectedId === identity.titulo
                                        ? "bg-white/10 border-neon-cyan text-white shadow-[0_0_20px_rgba(0,255,245,0.2)]"
                                        : "bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm tracking-wider uppercase font-bold truncate pr-4">
                                        {identity.titulo.split('—')[0]}
                                    </span>
                                    <div className={clsx(
                                        "w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]",
                                        selectedId === identity.titulo ? "animate-pulse" : "opacity-50"
                                    )}
                                        style={{ color: getIdentityColor(identity.titulo) }}
                                    />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Identity Detail View (The Canvas) */}
                <div className="md:col-span-2 relative">
                    <AnimatePresence mode="wait">
                        {activeIdentity ? (
                            <motion.div
                                key={activeIdentity.titulo}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col justify-center"
                            >
                                <div className="absolute top-0 right-0 font-mono text-xs opacity-30 text-neon-cyan">
                                    NODE_ACTIVE: {activeIdentity.titulo.split('—')[0].toUpperCase()}
                                </div>

                                <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-2">
                                    {activeIdentity.titulo.split('—')[0]}
                                </h2>
                                <h3 className="text-lg text-neon-cyan font-mono mb-8 opacity-80">
                                    {activeIdentity.titulo.split('—')[1]}
                                </h3>

                                <div className="space-y-8">
                                    <div className="bg-black/40 border-l-2 border-neon-cyan p-6 rounded-r-lg backdrop-blur-sm">
                                        <p className="text-xl italic font-serif text-white/90 leading-relaxed">
                                            "{activeIdentity.esencia_corta}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded border border-white/10">
                                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Element</div>
                                            <div className="font-mono text-accent-violet">{activeIdentity.elemento}</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded border border-white/10">
                                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Pattern</div>
                                            <div className="font-mono text-accent-violet">{activeIdentity.patron}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Deep Essence</div>
                                        <p className="text-gray-300 leading-relaxed text-sm">
                                            {activeIdentity.esencia_profunda}
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-white/10">
                                        <div className="font-mono text-xs text-center text-gray-500">
                                            // {activeIdentity.frase_definitoria} //
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center opacity-30">
                                <div>
                                    <div className="text-6xl mb-4 text-white/20">⌬</div>
                                    <p className="font-mono text-sm max-w-xs mx-auto">
                                        SELECT AN IDENTITY NODE TO DECRYPT NEURAL PATTERNS
                                    </p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Helper for colors based on identity name (fallback if JSON color is complex string)
function getIdentityColor(name: string): string {
    if (name.includes("Kali")) return "#ff0055"; // Pink/Red
    if (name.includes("Set")) return "#ff4400"; // Orange
    if (name.includes("Anuket")) return "#00ccff"; // Cyan
    if (name.includes("Kilonova")) return "#ffd700"; // Gold
    if (name.includes("4NVSET")) return "#00ff00"; // Green
    if (name.includes("Saze")) return "#cccccc"; // Grey
    if (name.includes("Rosa")) return "#ffccff"; // Pink
    if (name.includes("Kanuv")) return "#aaddff"; // Ice
    return "#ffffff";
}
