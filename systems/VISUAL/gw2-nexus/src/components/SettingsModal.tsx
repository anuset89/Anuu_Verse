
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ArrowLeft, Database } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, currentKey, onSave, isEng }: { isOpen: boolean, onClose: () => void, currentKey: string, onSave: (key: string) => void, isEng: boolean }) => {
    const [key, setKey] = useState(currentKey);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="matte-card w-full max-w-md p-8 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)] relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><ArrowLeft className="rotate-180" size={20} /></button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Settings size={24} /></div>
                    <h3 className="text-xl font-black text-white uppercase font-display italic">{isEng ? 'System Configuration' : 'Configuración del Sistema'}</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Guild Wars 2 API Key</label>
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-zinc-300 focus:border-indigo-500 focus:outline-none font-mono text-xs shadow-inner"
                        />
                        <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
                            {isEng ? 'Permissions required: account, wallet, inventories. Key is stored locally in your browser.' : 'Permisos requeridos: account, wallet, inventories. La clave se guarda localmente en tu navegador.'}
                        </p>
                    </div>

                    <button
                        onClick={() => onSave(key)}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-900/40 flex justify-center items-center gap-2"
                    >
                        <Database size={16} /> {isEng ? 'Connect Nexus Link' : 'Conectar Nexus Link'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
