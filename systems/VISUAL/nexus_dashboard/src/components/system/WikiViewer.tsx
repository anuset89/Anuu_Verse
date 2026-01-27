import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { MermaidDiagram } from "../ui/MermaidDiagram";

interface WikiViewerProps {
    path: string; // e.g., "identities/KALI.md" or "INDEX.md"
}

export function WikiViewer({ path }: WikiViewerProps) {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Normalize path to handle both docs/ and root-level files
    const docUrl = path.startsWith('../')
        ? `/Anuu_Verse/${path.replace('../', '')}`
        : `/Anuu_Verse/docs/${path.replace(/^\//, "")}`;

    useEffect(() => {
        // Loading state is reset when path changes

        fetch(docUrl)
            .then(async (res) => {
                if (!res.ok) throw new Error("Doc not found");
                const text = await res.text();
                setContent(text);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Wiki fetch error:", err);
                setError(true);
                setLoading(false);
            });
    }, [path, docUrl]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 font-mono text-purple-400 animate-pulse">
                [LOADING_MEMORY_FRAGMENT...]
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 border border-red-900 bg-red-950/20 text-red-500 font-mono">
                <h2 className="text-xl font-bold mb-2">404 // MEMORY_CORRUPTED</h2>
                <p>Could not retrieve document: {path}</p>
                <p className="text-xs mt-4 opacity-50">Check if the file exists in the Grimoire.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose prose-invert prose-purple max-w-none 
                 prose-h1:font-display prose-h1:text-4xl prose-h1:tracking-tight prose-h1:text-white
                 prose-h2:text-purple-400 prose-h2:border-b prose-h2:border-purple-900/50 prose-h2:pb-2
                 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                 prose-code:text-pink-300 prose-code:bg-black/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                 prose-pre:bg-black/80 prose-pre:border prose-pre:border-purple-500/20"
        >
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                    // Override links to handle internal navigation if needed later
                    a: ({ ...props }) => {
                        return <a {...props} className="text-cyan-400 hover:text-cyan-300 transition-colors" />
                    },
                    code: ({ inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        if (!inline && match && match[1] === "mermaid") {
                            return <MermaidDiagram chart={String(children).replace(/\n$/, "")} />;
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </motion.div>
    );
}
