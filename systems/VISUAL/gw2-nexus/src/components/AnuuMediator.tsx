
import { motion } from 'framer-motion';
import { Brain, Cpu } from 'lucide-react';

export const AnuuMediator = ({ thought, status, onReload }: { thought: string, status: 'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE', onReload?: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden matte-card p-6 transition-all duration-500 mb-8 ${status === 'THINKING' ? 'border-indigo-500/40' : status === 'ALERT' ? 'border-red-500/40' : 'border-white/5'}`}
    >
        <div className="absolute top-0 right-0 p-4 opacity-5"><Brain size={120} /></div>
        <div className="flex items-start gap-5 relative z-10">
            <div onClick={onReload} className={`p-4 rounded-2xl border cursor-pointer hover:scale-110 transition-transform ${status === 'THINKING' ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-zinc-800 bg-black/20'}`}>
                <Cpu size={28} className={status === 'THINKING' ? 'text-indigo-400' : 'text-zinc-500'} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase font-display">Anuu Nexus Core</h2>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-mono ${status === 'THINKING' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800/50 text-zinc-500'}`}>{status === 'THINKING' ? 'PROCESSING' : 'ONLINE'}</span>
                </div>
                <p className={`text-lg md:text-xl font-medium leading-relaxed font-display text-matte-accent`}>{thought}</p>
            </div>
        </div>
    </motion.div>
);
