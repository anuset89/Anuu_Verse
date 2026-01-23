import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
        fontFamily: "Inter, sans-serif",
        primaryColor: "#8A2BE2",
        primaryTextColor: "#fff",
        primaryBorderColor: "#5BCEFA",
        lineColor: "#F5A9B8",
        secondaryColor: "#000000",
        tertiaryColor: "#1a1a1a",
    },
});

export function MermaidDiagram({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
        if (!chart) return;

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        mermaid.render(id, chart).then(({ svg }) => {
            setSvg(svg);
        }).catch(err => {
            console.error("Mermaid render error:", err);
            setSvg(`<div class="text-red-500 font-mono text-xs p-2 border border-red-900">Mermaid Error: Invalid Syntax</div>`);
        });
    }, [chart]);

    return (
        <div
            ref={ref}
            className="my-6 p-4 bg-black/40 border border-purple-900/30 rounded-lg overflow-x-auto flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
