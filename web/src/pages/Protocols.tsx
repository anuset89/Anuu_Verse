import { motion } from "framer-motion";

export function Protocols() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="border-b border-white/10 pb-6 mb-12">
                <h1 className="text-4xl font-display font-bold text-white mb-2">System Protocols</h1>
                <p className="text-gray-400 font-mono text-sm">/library/core_knowledge</p>
            </div>

            <div className="glass-panel p-12 text-center">
                <h2 className="text-2xl font-bold text-neon-cyan mb-4">Archives Locked</h2>
                <p className="text-gray-400 mb-8">
                    The markdown viewer module is currently compiling. Access to deep system logs will be available in the next cycle.
                </p>
                <div className="inline-flex gap-2 items-center px-4 py-2 bg-white/5 border border-white/10 rounded font-mono text-xs text-yellow-400">
                    <span className="animate-pulse">●</span> COMPILING_RENDERER
                </div>
            </div>
        </motion.div>
    );
}
