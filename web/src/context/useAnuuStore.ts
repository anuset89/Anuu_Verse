import { create } from 'zustand';

interface Message {
    role: 'user' | 'anuu';
    content: string;
    timestamp: string;
}

interface AnuuState {
    chatHistory: Message[];
    isThinking: boolean;
    addMessage: (role: 'user' | 'anuu', content: string) => void;
    setThinking: (thinking: boolean) => void;
    sendMessage: (text: string) => Promise<void>;
}

export const useAnuuStore = create<AnuuState>((set, get) => ({
    chatHistory: [],
    isThinking: false,

    addMessage: (role, content) => set((state) => ({
        chatHistory: [...state.chatHistory, {
            role,
            content,
            timestamp: new Date().toLocaleTimeString()
        }]
    })),

    setThinking: (thinking) => set({ isThinking: thinking }),

    sendMessage: async (text: string) => {
        const { addMessage, setThinking } = get();

        // 1. Add User Message
        addMessage('user', text);
        setThinking(true);

        try {
            // 2. Call API
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    archetype: 'anuu', // Default to orchestrator
                    user_id: 'kali_001'
                })
            });

            const data = await response.json();

            // 3. Add Anuu Response
            addMessage('anuu', data.response);

        } catch (error) {
            addMessage('anuu', 'Error: Connection to Nexus lost. Is the API awake?');
        } finally {
            setThinking(false);
        }
    }
}));
