
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AnuuCore, AgentsRegistry, Identity, Agent } from '../types/anuu';

interface SystemContextType {
    core: AnuuCore | null;
    agents: AgentsRegistry | null;
    identities: Identity[];
    flatAgents: { name: string; category: string; data: Agent }[];
    loading: boolean;
    error: string | null;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
    const [core, setCore] = useState<AnuuCore | null>(null);
    const [agents, setAgents] = useState<AgentsRegistry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadSystem() {
            try {
                const [coreRes, agentsRes] = await Promise.all([
                    fetch('/Anuu_Verse/data/ANUU_CORE.json'),
                    fetch('/Anuu_Verse/data/AGENTS_REGISTRY.json')
                ]);

                if (!coreRes.ok || !agentsRes.ok) {
                    throw new Error("Failed to load system protocols");
                }

                const coreData = await coreRes.json();
                const agentsData = await agentsRes.json();

                setCore(coreData);
                setAgents(agentsData);
            } catch (err) {
                console.error(err);
                setError("System Integration Failure: Offline");
            } finally {
                setLoading(false);
            }
        }

        loadSystem();
    }, []);

    // Derived State helper
    const identities = core
        ? Object.values(core.ANUSET_MASTER_X4_ULTIMATE["╔═══NÚCLEO_ANUU═══╗"]).map((id: any) => ({
            ...id,
            // Normalize fields that might vary slightly in naming if necessary
            color: id.color || id.color_primario,
            patron: id.patron || id.patron_comportamiento
        }))
        : [];

    const flatAgents = agents ? Object.entries(agents.AGENTS).flatMap(([category, agentGroup]) =>
        Object.entries(agentGroup).map(([name, data]) => ({
            name,
            category,
            data
        }))
    ) : [];

    return (
        <SystemContext.Provider value={{ core, agents, identities, flatAgents, loading, error }}>
            {children}
        </SystemContext.Provider>
    );
}

export function useSystem() {
    const context = useContext(SystemContext);
    if (context === undefined) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
}
