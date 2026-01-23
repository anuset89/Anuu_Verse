import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface DocViewerProps {
    owner: string;
    repo: string;
    path: string;
    branch?: string;
}

export function DocViewer({ owner, repo, path, branch = 'main' }: DocViewerProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDoc() {
            setLoading(true);
            setError(null);
            try {
                const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Failed to load document: ${res.statusText}`);
                const text = await res.text();
                setContent(text);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown signal interruption");
                }
            } finally {
                setLoading(false);
            }
        }

        if (path) {
            fetchDoc();
        }
    }, [owner, repo, path, branch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-cyan"></div>
                <span className="ml-3 text-neon-cyan font-mono text-sm">TRANSMITTING_DATA...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400 font-mono">
                DATA_CORRUPTION_ERROR: {error}
            </div>
        );
    }

    return (
        <div className="prose prose-invert prose-neon max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({ ...props }) => <h1 className="font-display text-3xl font-bold text-white mb-6 border-b border-white/10 pb-2" {...props} />,
                    h2: ({ ...props }) => <h2 className="font-display text-2xl font-semibold text-neon-cyan mt-8 mb-4" {...props} />,
                    h3: ({ ...props }) => <h3 className="font-display text-xl text-accent-violet mt-6 mb-3" {...props} />,
                    code: ({ ...props }) => <code className="bg-[#0a0a1a] text-neon-cyan px-1 py-0.5 rounded font-mono text-sm" {...props} />,
                    pre: ({ ...props }) => <pre className="bg-[#0a0a1a] border border-white/10 p-4 rounded-lg overflow-x-auto my-4" {...props} />,
                    a: ({ ...props }) => <a className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4 transition-colors" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 text-gray-300 my-4" {...props} />,
                    p: ({ ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
