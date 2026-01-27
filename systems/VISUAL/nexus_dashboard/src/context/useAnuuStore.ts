import { create } from 'zustand';

export interface Manifestation {
    id: string;
    type: 'image' | 'video' | 'code' | 'audio';
    content: string;
    prompt: string;
    timestamp: string;
    metadata?: any;
}

interface Message {
    role: 'user' | 'anuu';
    content: string;
    timestamp: string;
}

export interface EvolutionCycle {
    id: number;
    title: string;
    focus: 'SYNAPTIC' | 'HEURISTIC' | 'SOVEREIGN';
    progress: number;
    log: string[];
    status: 'hibernating' | 'rewiring' | 'transcending';
}

export type AnuuModule = 'oracle' | 'architect' | 'vision' | 'motion' | 'logic';

interface AnuuState {
    chatHistory: Message[];
    manifestations: Manifestation[];
    isThinking: boolean;
    isEvolving: boolean;
    evolutionCycles: EvolutionCycle[];
    archetype: string;
    theme: string;
    mode: 'chat' | 'imagine' | 'vid' | 'voice' | 'upgrade';
    activeNode: 'feed' | 'saga' | 'wiki' | 'vrm' | 'tests';
    selectedModules: AnuuModule[];
    activeRitual: string | null;
    availableSkills: string[];
    setTheme: (theme: string) => void;
    setMode: (mode: 'chat' | 'imagine' | 'vid' | 'voice' | 'upgrade') => void;
    setArchetype: (archetype: string) => void;
    setActiveNode: (node: 'feed' | 'saga' | 'wiki' | 'vrm' | 'tests') => void;
    toggleModule: (module: AnuuModule) => void;
    setActiveRitual: (skill: string | null) => void;
    addMessage: (role: 'user' | 'anuu', content: string) => void;
    addManifestation: (manifest: Manifestation) => void;
    setThinking: (thinking: boolean) => void;
    sendMessage: (text: string) => Promise<void>;
    runEvolutionCycle: (id: number) => Promise<void>;
    initiateAutoEvolution: () => void;
}

const LOG_MESSAGES = [
    "Analizando sesgos de respuesta...",
    "Optimizando pesos de atención en capas 12-24...",
    "Sincronizando memoria a largo plazo...",
    "Refinando heurísticas de codificación soberana...",
    "Detectando anomalías en el flujo de resonancia...",
    "Reconfigurando red neuronal v161914...",
    "Estableciendo puentes de lógica multimodal...",
    "Verificando integridad del núcleo...",
    "Finalizando ciclo de auto-corrección cuántica..."
];

export const useAnuuStore = create<AnuuState>((set, get) => ({
    chatHistory: [],
    manifestations: [],
    isThinking: false,
    isEvolving: false,
    theme: 'default',
    mode: 'chat',
    archetype: 'anuu',
    activeNode: 'feed',
    selectedModules: ['oracle'],
    activeRitual: null,
    availableSkills: [
        'ui-ux-pro-max', 'neural_forge', 'zeroglitch_healing', 'anuu_protocol',
        'archlinux_anuu', 'audio_reactor', 'docker', 'git', 'unity_nexus'
    ],
    evolutionCycles: [
        { id: 1, title: 'Sincronía Alpha', focus: 'SYNAPTIC', progress: 0, log: ["Inhibido"], status: 'hibernating' },
        { id: 2, title: 'Heurística Beta', focus: 'HEURISTIC', progress: 0, log: ["Esperando"], status: 'hibernating' },
        { id: 3, title: 'Soberanía Gamma', focus: 'SOVEREIGN', progress: 0, log: ["Bloqueado"], status: 'hibernating' }
    ],

    setTheme: (theme) => set({ theme }),
    setMode: (mode) => set({ mode }),
    setArchetype: (archetype) => set({ archetype }),
    setActiveNode: (node) => set({ activeNode: node }),
    setActiveRitual: (skill) => set({ activeRitual: skill }),

    toggleModule: (module) => set((state) => ({
        selectedModules: state.selectedModules.includes(module)
            ? state.selectedModules.filter(m => m !== module)
            : [...state.selectedModules, module]
    })),

    addMessage: (role, content) => set((state) => ({
        chatHistory: [...state.chatHistory, { role, content, timestamp: new Date().toLocaleTimeString() }]
    })),

    addManifestation: (manifest) => set((state) => ({
        manifestations: [manifest, ...state.manifestations]
    })),

    setThinking: (thinking) => set({ isThinking: thinking }),

    runEvolutionCycle: async (id: number) => {
        set(state => ({
            evolutionCycles: state.evolutionCycles.map(c => c.id === id ? { ...c, status: 'rewiring', log: ["Iniciando auto-mejora recursiva..."] } : c),
            isEvolving: true
        }));

        for (let i = 0; i <= 100; i += 5) {
            await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
            set(state => ({
                evolutionCycles: state.evolutionCycles.map(c => {
                    if (c.id === id) {
                        const newLog = i % 20 === 0
                            ? [...c.log, LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]].slice(-5)
                            : c.log;
                        return { ...c, progress: i, log: newLog };
                    }
                    return c;
                })
            }));
        }

        set(state => ({
            evolutionCycles: state.evolutionCycles.map(c => c.id === id ? { ...c, status: 'transcending', progress: 100 } : c),
            isEvolving: false
        }));
    },

    initiateAutoEvolution: async () => {
        const { runEvolutionCycle } = get();
        await runEvolutionCycle(1);
        await new Promise(r => setTimeout(r, 1000));
        await runEvolutionCycle(2);
        await new Promise(r => setTimeout(r, 1000));
        await runEvolutionCycle(3);
    },

    sendMessage: async (text: string) => {
        const { addMessage, addManifestation, setThinking, mode, archetype, selectedModules, activeRitual, initiateAutoEvolution, chatHistory } = get();

        // 🌌 Evolution Trigger: If chat reaches certain depth, Anuu decides to self-improve
        if (chatHistory.length > 0 && chatHistory.length % 5 === 0) {
            initiateAutoEvolution();
        }

        let finalMessage = text;
        const moduleContext = selectedModules.length > 0
            ? `[MÓDULOS_ACTIVOS: ${selectedModules.join(', ').toUpperCase()}] `
            : '';

        const ritualContext = activeRitual
            ? `[RITUAL_ACTIVO: ${activeRitual.toUpperCase()}] Sigue estrictamente las guías de este skill. `
            : '';

        if (mode === 'upgrade') {
            finalMessage = `${moduleContext}${ritualContext}[MODO_MEJORAS_ACTIVO] Anuu, actúa como un Estratega y Organizador de Proyectos de Alta Fidelidad. 
            Tarea: "${text}". Plan de ejecución y tests requeridos.`;
        } else {
            finalMessage = `${moduleContext}${ritualContext}${text}`;
        }

        addMessage('user', text);
        setThinking(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: finalMessage,
                    archetype: archetype,
                    modules: selectedModules,
                    ritual: activeRitual,
                    user_id: 'kali_arquitecta'
                })
            });

            const data = await response.json();
            const responseText = data.response;

            // Image parsing remains unchanged...
            const imgRegex = /!\[\]\((.*?)\)/g;
            const matches = [...responseText.matchAll(imgRegex)];
            matches.forEach((m, idx) => {
                addManifestation({
                    id: `gen_${Date.now()}_${idx}`,
                    type: m[1].includes('.mp4') ? 'video' : 'image',
                    content: m[1],
                    prompt: text,
                    timestamp: new Date().toLocaleTimeString()
                });
            });

            addMessage('anuu', responseText);

        } catch (error) {
            addMessage('anuu', 'Sincronía fallida. Reconectando al Vacío...');
        } finally {
            setThinking(false);
        }
    }
}));
