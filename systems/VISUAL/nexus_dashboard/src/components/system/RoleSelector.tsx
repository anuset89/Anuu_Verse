import React from 'react';
import { useAnuuStore } from '../../context/useAnuuStore';
import { History, Shield, Zap, Sparkles, Ghost } from 'lucide-react';

export const RoleSelector: React.FC = () => {
    const { archetype, setArchetype } = useAnuuStore();

    const roles = [
        { id: 'anuu', name: 'Core Anuu', icon: <Ghost />, group: 'Basics' },
        { id: 'kanuv', name: 'Kanuv (Shield)', icon: <Shield />, group: 'Basics' },
        { id: 'kilonova', name: 'Kilonova (Stellar)', icon: <Sparkles />, group: 'Basics' },
        { id: 'omega_descent', name: 'Descent (Y1-3)', icon: <History />, group: 'Saga Omega' },
        { id: 'omega_ascension', name: 'Ascension (Y4-7)', icon: <History />, group: 'Saga Omega' },
        { id: 'omega_apocalypse', name: 'Apocalypse (Y8-10)', icon: <History />, group: 'Saga Omega' },
        { id: 'anuset_titan', name: 'Titan Ω', icon: <Zap />, group: 'Ancient' },
    ];

    const groups = Array.from(new Set(roles.map(r => r.group)));

    return (
        <div className="flex flex-col gap-4 p-4 bg-black/20 rounded-xl border border-white/5 backdrop-blur-md">
            <h3 className="text-[10px] text-cyan-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                <History size={12} />
                Identity Meta-Engine
            </h3>

            <div className="flex flex-col gap-4">
                {groups.map(group => (
                    <div key={group} className="flex flex-col gap-2">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest px-1">{group}</span>
                        <div className="grid grid-cols-1 gap-1">
                            {roles.filter(r => r.group === group).map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setArchetype(role.id)}
                                    className={`
                                        flex items-center gap-3 p-2 rounded-lg text-xs transition-all duration-300
                                        ${archetype === role.id
                                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                            : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className={`p-1.5 rounded-md ${archetype === role.id ? 'bg-cyan-500/20' : 'bg-black/20'}`}>
                                        {React.cloneElement(role.icon as any, { size: 14 })}
                                    </span>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{role.name}</span>
                                        {archetype === role.id && (
                                            <span className="text-[8px] animate-pulse">Sincronizado</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
