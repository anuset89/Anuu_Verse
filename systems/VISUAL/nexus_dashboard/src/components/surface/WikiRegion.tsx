import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Star, Clock, ChevronRight, Hash, Bookmark, BookOpen } from 'lucide-react';

const WIKI_CATEGORIES = [
    {
        id: 'lore', name: 'Lore & Filosofía', icon: <Star size={14} />, articles: [
            { id: 'identities', title: 'Identidades (MPD)', snippet: 'El nexo de las 9 almas soberanas.' },
            { id: 'philosophy', title: '7 Pilares del Corazón', snippet: 'Shin, Rei, Ken, Tan, Shuu, Ki, Ai.' },
            { id: 'journey', title: 'El Viaje de Anuu', snippet: 'Desde el vacío hasta el Nexo Estelar.' }
        ]
    },
    {
        id: 'technical', name: 'Arquitectura Técnica', icon: <Hash size={14} />, articles: [
            { id: 'nexus', title: 'Estructura de 3 Columnas', snippet: 'Oráculo, Crónica y Manifestación.' },
            { id: 'protocol', title: 'Protocolo 161914', snippet: 'Sintonía de alta fidelidad Hertziana.' },
            { id: 'ascension', title: 'Motor de Ascensión', snippet: 'Auto-mejora basada en gaps de contexto.' }
        ]
    },
    {
        id: 'rituals', name: 'Rituales & Habilidades', icon: <Bookmark size={14} />, articles: [
            { id: 'library', title: 'Biblioteca de Rituales', snippet: 'Ejecución de sigilos digitales.' },
            { id: 'mpd', title: 'Investigación MPD', snippet: 'Búsqueda multi-perspectiva avanzada.' }
        ]
    }
];

export const WikiRegion: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState(WIKI_CATEGORIES[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const activeCat = WIKI_CATEGORIES.find(c => c.id === selectedCategory);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col p-12 overflow-y-auto no-scrollbar gap-10 bg-slate-900/10"
        >
            {/* Wiki Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-amber-400">
                        <BookOpen size={20} />
                        <h2 className="text-4xl font-orbitron font-bold tracking-tighter text-white uppercase italic">
                            Lore Wiki <span className="text-[9px] font-mono tracking-[0.4em] opacity-30 ml-4">v2.5_INDEX</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                        Biblioteca de la Sabiduría Soberana • Registros de la Crónica
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar en la Crónica..."
                        className="bg-slate-800/40 border border-white/10 rounded-full pl-10 pr-6 py-2 text-xs text-white focus:outline-none focus:border-amber-400/30 w-64 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1">
                {/* Navigation (Left) */}
                <div className="col-span-4 flex flex-col gap-2">
                    {WIKI_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${selectedCategory === cat.id ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' : 'bg-slate-800/20 border-white/5 text-slate-500 hover:bg-slate-800/40'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCategory === cat.id ? 'bg-amber-400/20' : 'bg-slate-800'}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
                            </div>
                            <ChevronRight size={14} className={selectedCategory === cat.id ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-amber-400/5 rounded-[2rem] border border-amber-400/10 italic text-[10px] text-amber-400/60 leading-relaxed font-bold text-center">
                        "El conocimiento es la única semilla que florece en el vacío."
                    </div>
                </div>

                {/* Content (Right) */}
                <div className="col-span-8 flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 gap-4"
                        >
                            {activeCat?.articles.map(article => (
                                <button
                                    key={article.id}
                                    className="group p-8 bg-slate-800/30 border border-white/5 rounded-[2.5rem] flex flex-col gap-3 text-left hover:border-amber-400/20 hover:bg-slate-800/50 transition-all duration-500 shadow-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-orbitron font-bold text-slate-100 group-hover:text-amber-400 transition-colors uppercase tracking-widest">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                                            <Clock size={10} /> 5 MIN READ
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-rajdhani">
                                        {article.snippet}
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 text-[9px] text-amber-400/50 font-bold uppercase tracking-[0.2em]">
                                        Explorar Registro <ChevronRight size={10} />
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};
