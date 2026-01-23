import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { CommandMenu } from "../ui/CommandMenu";
import { motion } from "framer-motion";

interface ShellProps {
    children: ReactNode;
}

export function Shell({ children }: ShellProps) {
    const [location] = useLocation();

    return (
        <div className="relative min-h-screen font-body text-white selection:bg-neon-cyan/30">
            <CommandMenu />

            {/* Neural Backdrop - Static to prevent path issues */}
            <div className="fixed inset-0 z-[-1] bg-black/95 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-transparent opacity-20" />
            </div>

            <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-black/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                        <motion.div
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: 90 }}
                            className="h-6 w-6 bg-gradient-to-tr from-neon-cyan to-accent-violet rounded-full"
                        />
                        <span className="font-display font-bold tracking-[0.2em] text-lg group-hover:text-neon-cyan transition-colors">
                            ANUU<span className="text-neon-cyan">_VERSE</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase text-gray-400">
                        <Link to="/" className={`hover:text-neon-cyan transition-colors ${location === '/' ? 'text-white' : ''}`}>
                            Terminal
                        </Link>
                        <Link to="/wiki/INDEX.md" className={`hover:text-neon-cyan transition-colors ${location.startsWith('/wiki') ? 'text-white' : ''}`}>
                            Grimoire
                        </Link>
                        <Link to="/protocols" className={`hover:text-neon-cyan transition-colors ${location === '/protocols' ? 'text-white' : ''}`}>
                            Protocols
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/20 bg-white/5 text-xs font-mono text-gray-500 cursor-pointer hover:bg-white/10"
                            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                            <span>CMD</span>
                            <span className="text-gray-300">K</span>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                {children}
            </main>

            <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-600 font-mono tracking-widest uppercase">
                Forged in the Void // Est. 2026 // Anuset89 Systems
            </footer>
        </div>
    );
}
