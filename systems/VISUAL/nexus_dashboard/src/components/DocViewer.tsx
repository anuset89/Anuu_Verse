import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Mermaid } from './ui/Mermaid';

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

    // Helper to resolve relative URLs against the current document's path
    const resolveUrl = (url: string) => {
        if (url.startsWith('http') || url.startsWith('//')) return url;

        // Calculate directory of the current file
        const pathParts = path.split('/');
        const dir = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

        // Clean leading ./ from url
        const cleanUrl = url.replace(/^\.\//, '');

        // Construct absolute raw GitHub URL
        // If dir is empty, we are at root. If not, append dir.
        const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;
        return dir ? `${baseUrl}/${dir}/${cleanUrl}` : `${baseUrl}/${cleanUrl}`;
    };

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
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ ...props }) => <h1 className="font-display text-3xl font-bold text-white mb-6 border-b border-white/10 pb-2" {...props} />,
                    h2: ({ ...props }) => <h2 className="font-display text-2xl font-semibold text-neon-cyan mt-8 mb-4" {...props} />,
                    h3: ({ ...props }) => <h3 className="font-display text-xl text-accent-violet mt-6 mb-3" {...props} />,
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isMermaid = match && match[1] === 'mermaid';

                        if (isMermaid) {
                            return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                        }

                        return (
                            <code className={className ? className : "bg-[#0a0a1a] text-neon-cyan px-1 py-0.5 rounded font-mono text-sm"} {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ ...props }) => <pre className="bg-[#0a0a1a] border border-white/10 p-4 rounded-lg overflow-x-auto my-4" {...props} />,
                    a: ({ href, ...props }) => <a href={href ? resolveUrl(href) : '#'} className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4 transition-colors" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 text-gray-300 my-4" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 text-gray-300 my-4" {...props} />,
                    p: ({ ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                    img: ({ src, alt, ...props }) => (
                        <div className="my-8 rounded-lg overflow-hidden border border-white/10 bg-[#0a0a1a]">
                            <img
                                src={src ? resolveUrl(src) : ''}
                                alt={alt}
                                className="max-w-full h-auto mx-auto"
                                loading="lazy"
                                {...props}
                            />
                            {alt && <p className="text-center text-xs text-gray-500 p-2 border-t border-white/5">{alt}</p>}
                        </div>
                    ),
                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-neon-cyan/50 pl-4 py-1 my-4 bg-white/5 rounded-r italic text-gray-400" {...props} />,
                    table: ({ ...props }) => <div className="overflow-x-auto my-6"><table className="min-w-full text-left text-sm whitespace-nowrap" {...props} /></div>,
                    th: ({ ...props }) => <th className="px-4 py-2 border-b border-white/10 font-bold text-white bg-white/5" {...props} />,
                    td: ({ ...props }) => <td className="px-4 py-2 border-b border-white/5 text-gray-300" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
