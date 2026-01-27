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

export type AnuuModule = 'oracle' | 'architect' | 'vision' | 'motion' | 'logic';

interface AnuuState {
    chatHistory: Message[];
    manifestations: Manifestation[];
    isThinking: boolean;
    archetype: string;
    theme: string;
    mode: 'chat' | 'imagine' | 'vid' | 'voice' | 'upgrade';
    activeNode: 'feed' | 'saga' | 'wiki' | 'vrm';
    selectedModules: AnuuModule[];
    activeRitual: string | null;
    availableSkills: string[];
    setTheme: (theme: string) => void;
    setMode: (mode: 'chat' | 'imagine' | 'vid' | 'voice' | 'upgrade') => void;
    setArchetype: (archetype: string) => void;
    setActiveNode: (node: 'feed' | 'saga' | 'wiki' | 'vrm') => void;
    toggleModule: (module: AnuuModule) => void;
    setActiveRitual: (skill: string | null) => void;
    addMessage: (role: 'user' | 'anuu', content: string) => void;
    addManifestation: (manifest: Manifestation) => void;
    setThinking: (thinking: boolean) => void;
    sendMessage: (text: string) => Promise<void>;
}

export const useAnuuStore = create<AnuuState>((set, get) => ({
    chatHistory: [],
    manifestations: [],
    isThinking: false,
    theme: 'default',
    mode: 'chat',
    archetype: 'anuu',
    activeNode: 'feed',
    selectedModules: ['oracle'],
    activeRitual: null,
    availableSkills: [
        'ui-ux-pro-max',
        'neural_forge',
        'zeroglitch_healing',
        'anuu_protocol',
        'archlinux_anuu',
        'audio_reactor',
        'docker',
        'git',
        'unity_nexus'
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
        chatHistory: [...state.chatHistory, {
            role,
            content,
            timestamp: new Date().toLocaleTimeString()
        }]
    })),

    addManifestation: (manifest) => set((state) => ({
        manifestations: [manifest, ...state.manifestations]
    })),

    setThinking: (thinking) => set({ isThinking: thinking }),

    sendMessage: async (text: string) => {
        const { addMessage, addManifestation, setThinking, mode, archetype, selectedModules, activeRitual } = get();

        // 🌌 Advanced Anuu Evolution Logic
        let finalMessage = text;
        const moduleContext = selectedModules.length > 0
            ? `[MÓDULOS_ACTIVOS: ${selectedModules.join(', ').toUpperCase()}] `
            : '';

        const ritualContext = activeRitual
            ? `[RITUAL_ACTIVO: ${activeRitual.toUpperCase()}] Sigue estrictamente las guías de este skill. `
            : '';

        if (mode === 'upgrade') {
            finalMessage = `${moduleContext}${ritualContext}[MODO_MEJORAS_ACTIVO] Anuu, actúa como un Estratega y Organizador de Proyectos de Alta Fidelidad. 
            El usuario quiere realizar una tarea/investigación: "${text}".
            
            Tu misión es:
            1. REFINAR el prompt original para maximizar la calidad técnica.
            2. DISECCIONAR la tarea en un Plan de Ejecución claro con 3-4 "Tests/Pasos" accionables.
            3. ESTRUCTURAR la respuesta usando Markdown impecable:
               - ## 🪄 Prompt Optimizado
               - ## 🏗️ Plan de Ejecución (Tests)
               - ## 🛠️ Módulos y Skills Sugeridos
            
            Si hay un RITUAL_ACTIVO, usa su conocimiento experto para la disección.`;
        } else if (mode === 'imagine' && !text.startsWith('/imagine')) {
            finalMessage = `/imagine ${moduleContext}${ritualContext}${text}`;
        } else if (mode === 'vid' && !text.startsWith('/anime')) {
            finalMessage = `/anime ${moduleContext}${ritualContext}${text}`;
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

            const imgRegex = /!\[\]\((.*?)\)/g;
            const matches = [...responseText.matchAll(imgRegex)];

            matches.forEach((m, idx) => {
                const url = m[1];
                let type: 'image' | 'video' | 'code' | 'audio' = 'image';
                if (url.includes('.mp4')) type = 'video';
                else if (url.includes('.mp3') || url.includes('.wav')) type = 'audio';

                addManifestation({
                    id: `gen_${Date.now()}_${idx}`,
                    type,
                    content: url,
                    prompt: text,
                    timestamp: new Date().toLocaleTimeString()
                });
            });

            addMessage('anuu', responseText);

        } catch (error) {
            addMessage('anuu', 'Error de conexión con el Nexo.');
        } finally {
            setThinking(false);
        }
    }
}));
