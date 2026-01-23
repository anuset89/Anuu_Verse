
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        darkMode: true,
        background: '#0a0a1a',
        primaryColor: '#00fff5', // neon-cyan
        secondaryColor: '#8a2be2', // accent-violet
        tertiaryColor: '#1a1a2e',
        primaryTextColor: '#fff',
        secondaryTextColor: '#ddd',
        tertiaryTextColor: '#bbb',
        lineColor: '#00fff5',
        fontFamily: 'Outfit, sans-serif',
    },
    securityLevel: 'loose',
});

interface MermaidProps {
    chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return;
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                // mermaid.render returns an object { svg: string } in newer versions
                const result = await mermaid.render(id, chart);
                setSvg(result.svg);
                setError(null);
            } catch (err) {
                console.error("Mermaid error:", err);
                // Mermaid creates a syntax error element in the DOM on failure, 
                // but we can also capture it here.
                setError("Diagrama inválido (Neural Link Failed)");
            }
        };

        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className="border border-red-500/50 bg-red-500/10 p-4 rounded text-red-400 font-mono text-xs">
                {error}
                <pre className="mt-2 opacity-50">{chart}</pre>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className="mermaid-diagram my-8 flex justify-center bg-[#0a0a1a]/50 p-6 rounded-xl border border-white/5"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
