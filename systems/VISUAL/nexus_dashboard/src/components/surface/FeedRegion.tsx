import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Code, FileText, Maximize2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAnuuStore, type Manifestation } from '../../context/useAnuuStore';

const FeedItem: React.FC<{ m: Manifestation }> = ({ m }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative flex flex-col gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-[var(--color-accent)]/20 transition-all mb-4 overflow-hidden"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate max-w-[150px]">
                        {m.prompt.split(' ').slice(0, 3).join(' ')}...
                    </span>
                </div>
                <span className="text-[8px] opacity-30 font-mono italic">{m.timestamp}</span>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5">
                {m.type === 'video' ? (
                    <video src={m.content} className="w-full h-full object-cover" muted loop autoPlay />
                ) : (
                    <img src={m.content} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white">
                        <Maximize2 size={12} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="text-[8px] px-2 py-0.5 rounded bg-white/5 border border-white/5 uppercase tracking-widest text-gray-500">
                    {m.type}
                </div>
                <div className="flex-1 h-[1px] bg-white/5" />
                <div className="flex items-center gap-1 opacity-20">
                    <Sparkles size={10} />
                    <span className="text-[8px]">161.9</span>
                </div>
            </div>
        </motion.div>
    );
};

export const FeedRegion: React.FC = () => {
    const { manifestations } = useAnuuStore();

    return (
        <div className="flex flex-col">
            <AnimatePresence mode="popLayout">
                {manifestations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
                        <Sparkles size={24} className="text-gray-500" />
                        <p className="text-[10px] tracking-[0.3em] uppercase">No hay crónicas activas</p>
                    </div>
                ) : (
                    manifestations.map((m) => (
                        <FeedItem key={m.id} m={m} />
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
