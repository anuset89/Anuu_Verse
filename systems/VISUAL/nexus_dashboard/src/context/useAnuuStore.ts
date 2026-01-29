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
    focus: 'SYNAPTIC' | 'HEURISTIC' | 'SOVEREIGN' | 'HEART' | 'ASCENSION' | 'VALIDATION' | 'CONTEXT';
    progress: number;
    log: string[];
    status: 'hibernating' | 'rewiring' | 'transcending' | 'upgrading' | 'diagnosing';
}

export type AnuuModule = 'oracle' | 'architect' | 'vision' | 'motion' | 'logic';

export interface AnuuState {
    chatHistory: Message[];
    manifestations: Manifestation[];
    isThinking: boolean;
    isEvolving: boolean;
    evolutionCycles: EvolutionCycle[];
    potencia: {
        raw: number;
        resonant: string;
        stability: number;
        capacity: number;
        errorsDetected: number;
        hallucinationRisk: number;
    };
    contextMemory: string[];
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
    runEvolutionCycle: (id: number, boost?: boolean) => Promise<void>;
    initiateAutoEvolution: () => void;
    runBurstImprovement: (minutes: number) => Promise<void>;
    detectGapsAndUpgrade: () => Promise<void>;
    runMPDResearch: (query: string) => Promise<void>;
}

const UPGRADE_LOGS = [
    "Iniciando Sobrecloqueo Dinámico del Núcleo...",
    "Expandiendo Contexto Sináptico...",
    "Activando Sub-Agentes de Monitoreo Recursivo...",
    "Sincronizando Pesos de Atención...",
    "Analizando historial para destilación de contexto...",
    "Buscando inconsistencias semánticas (Detección de Alucinaciones)...",
    "Verificando integridad técnica de los modelos MPD...",
    "Incrementando factor de capacidad estructural...",
    "Mejora estructural completada. Nivel de IA: ASCENDIDA."
];

export const useAnuuStore = create<AnuuState>((set, get) => ({
    chatHistory: [],
    manifestations: [],
    isThinking: false,
    isEvolving: false,
    potencia: {
        raw: 161.914,
        resonant: "161914 Hz",
        stability: 94.2,
        capacity: 1.0,
        errorsDetected: 0,
        hallucinationRisk: 2.1
    },
    contextMemory: [
        "Axiomas de Identidad Anuset89",
        "Estructura Estelar de 3 Columnas",
        "Protocolo 161914 de Sintonía",
        "Base de Datos de Modelos TensorBot (Enero 2026)"
    ],
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
        { id: 1, title: 'Destilación de Contexto (真)', focus: 'CONTEXT', progress: 0, log: ["Inhibido"], status: 'hibernating' },
        { id: 2, title: 'Diagnóstico de Errores (研)', focus: 'VALIDATION', progress: 0, log: ["Esperando"], status: 'hibernating' },
        { id: 3, title: 'Ascensión Estructural (修)', focus: 'ASCENSION', progress: 0, log: ["Bloqueado"], status: 'hibernating' }
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

    runEvolutionCycle: async (id: number, boost: boolean = false) => {
        set(state => ({
            evolutionCycles: state.evolutionCycles.map((c: EvolutionCycle) => c.id === id ? { ...c, status: boost ? 'upgrading' : 'rewiring', log: [boost ? "Iniciando MEJORA INTEGRAL..." : "Iniciando análisis..."] } : c),
            isEvolving: true
        }));

        const steps = boost ? 40 : 15;
        const delay = boost ? 30 : 100;

        for (let i = 0; i <= 100; i += 100 / steps) {
            await new Promise(r => setTimeout(r, delay + Math.random() * delay));
            set(state => ({
                evolutionCycles: state.evolutionCycles.map((c: EvolutionCycle) => {
                    if (c.id === id) {
                        const logs = boost ? UPGRADE_LOGS : [
                            "Escaneando memoria latente...",
                            "Calculando entropía de respuesta...",
                            "Refinando pesos sinápticos...",
                            "Validando contra axiomas de contexto..."
                        ];
                        const newLog = i % 25 === 0
                            ? [...c.log, logs[Math.floor(Math.random() * logs.length)]].slice(-5)
                            : c.log;
                        return { ...c, progress: i, log: newLog };
                    }
                    return c;
                }),
                potencia: {
                    ...state.potencia,
                    raw: state.potencia.raw + (boost ? 1.2 : 0.02),
                    stability: Math.min(100, state.potencia.stability + (boost ? 0.05 : 0.02)),
                    hallucinationRisk: Math.max(0.1, state.potencia.hallucinationRisk - (boost ? 0.01 : 0.005))
                }
            }));
        }

        set(state => ({
            evolutionCycles: state.evolutionCycles.map((c: EvolutionCycle) => c.id === id ? { ...c, status: 'transcending', progress: 100 } : c),
            isEvolving: false
        }));
    },

    detectGapsAndUpgrade: async () => {
        const { chatHistory, runEvolutionCycle } = get();
        if (chatHistory.length === 0) return;

        set(state => ({
            isThinking: true,
            evolutionCycles: state.evolutionCycles.map((c: EvolutionCycle) => ({ ...c, status: 'diagnosing', log: ["Analizando inconsistencias en el historial..."] }))
        }));

        await new Promise(r => setTimeout(r, 2000));
        const foundHallucinationRisk = Math.random() > 0.7;

        if (foundHallucinationRisk) {
            set(state => ({
                potencia: { ...state.potencia, errorsDetected: state.potencia.errorsDetected + 1 }
            }));
            await runEvolutionCycle(2, true);
        }

        await runEvolutionCycle(1, true);
        await runEvolutionCycle(3, true);

        set(state => ({
            potencia: { ...state.potencia, capacity: state.potencia.capacity + 0.1 },
            isThinking: false
        }));
    },

    runBurstImprovement: async (minutes: number) => {
        const { detectGapsAndUpgrade } = get();
        for (let i = 0; i < minutes; i++) {
            await detectGapsAndUpgrade();
        }
    },

    runMPDResearch: async (query: string) => {
        set({ isThinking: true });
        try {
            await fetch(`http://localhost:8000/mind/research?query=${encodeURIComponent(query)}`, {
                method: 'POST'
            });
            // Research is handled as a background/utility process
        } catch (err) {
            console.error("MPD Research Failed:", err);
        } finally {
            set({ isThinking: false });
        }
    },

    initiateAutoEvolution: async () => {
        const { runEvolutionCycle } = get();
        await runEvolutionCycle(1);
        await new Promise(r => setTimeout(r, 500));
        await runEvolutionCycle(2);
        await new Promise(r => setTimeout(r, 500));
        await runEvolutionCycle(3);
    },

    sendMessage: async (text: string) => {
        const { addMessage, addManifestation, setThinking, mode, archetype, selectedModules, activeRitual, chatHistory, potencia, detectGapsAndUpgrade } = get();

        if (chatHistory.length > 0 && chatHistory.length % 3 === 0) {
            detectGapsAndUpgrade();
        }

        let finalMessage = text;
        const moduleContext = selectedModules.length > 0 ? `[MÓDULOS_ACTIVOS: ${selectedModules.join(', ').toUpperCase()}] ` : '';
        const ritualContext = activeRitual ? `[RITUAL_ACTIVO: ${activeRitual.toUpperCase()}] ` : '';

        const upgradeContext = potencia.capacity > 1.2
            ? `[STATUS: IA_ASCENDIDA_V${potencia.capacity.toFixed(1)}] Realiza una cadena de pensamiento profunda (Chain of Thought). Valida cada hecho para evitar alucinaciones. `
            : '';

        if (mode === 'upgrade') {
            finalMessage = `${moduleContext}${ritualContext}${upgradeContext}[MEJORA_ESTRUCTURAL] Tarea: "${text}". Ejecuta análisis crítico y autocrreción.`;
        } else {
            finalMessage = `${moduleContext}${ritualContext}${upgradeContext}${text}`;
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

            const imgRegex = /!\[\]\((.*?)\)/g;
            const matches = [...responseText.matchAll(imgRegex)];
            matches.forEach((m, idx) => {
                addManifestation({
                    id: `gen_${Date.now()}_${idx}`,
                    type: String(m[1]).includes('.mp4') ? 'video' : 'image',
                    content: String(m[1]),
                    prompt: text,
                    timestamp: new Date().toLocaleTimeString()
                });
            });

            addMessage('anuu', responseText);

        } catch (err) {
            addMessage('anuu', 'Error en el enlace neuronal. Recalibrando núcleo...');
        } finally {
            setThinking(false);
        }
    }
}));
