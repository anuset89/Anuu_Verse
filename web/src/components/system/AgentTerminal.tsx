
import { useSystem } from '../../context/SystemContext';
import { motion } from 'framer-motion';

export function AgentTerminal() {
    const { flatAgents, loading } = useSystem();

    if (loading) return null;

    return (
        <div className="w-full bg-[#0a0f0a] border border-[#33ff00]/20 rounded-xl overflow-hidden font-mono text-xs md:text-sm">
            {/* Terminal Header */}
            <div className="bg-[#1a201a] p-3 border-b border-[#33ff00]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[#33ff00]/50 tracking-widest">
                    SYSTEM_MONITOR :: AGENTS_ACTIVE [{flatAgents.length}]
                </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flatAgents.map((agent) => (
                        <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#051005] border border-[#33ff00]/10 p-4 rounded hover:border-[#33ff00]/50 hover:bg-[#0a200a] transition-colors group cursor-default"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[#33ff00] font-bold group-hover:text-white transition-colors">
                                    {agent.name}
                                </span>
                                <span className="text-[#33ff00]/30 text-[10px] uppercase">
                                    {agent.category}
                                </span>
                            </div>

                            <div className="space-y-2 text-[#33ff00]/70">
                                <div>
                                    <span className="opacity-50 mr-2">{'>'} ROLE:</span>
                                    <span className="text-white/80">{agent.data.role}</span>
                                </div>
                                <div className="truncate">
                                    <span className="opacity-50 mr-2">{'>'} TRIG:</span>
                                    <span>{agent.data.trigger}</span>
                                </div>
                                <div>
                                    <span className="opacity-50 mr-2">{'>'} SPEC:</span>
                                    <span className="text-yellow-400/80">{agent.data.superpower}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-[#33ff00] animate-pulse">
                    {'>'} AWAITING_FURTHER_INSTRUCTIONS..._
                </div>
            </div>
        </div>
    );
}
