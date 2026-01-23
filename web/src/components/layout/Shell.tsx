import type { ReactNode } from "react";
import { CommandMenu } from "../ui/CommandMenu";
import { motion } from "framer-motion";

interface ShellProps {
    children: ReactNode;
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="relative min-h-screen font-body text-white selection:bg-neon-cyan/30">
            <CommandMenu />

            {/* Animated Nebula Background (CSS handled in index.css via body, but we add an overlay here if needed) */}
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-[url('/scanlines.png')] opacity-[0.03] mix-blend-overlay"></div>

            <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-black/20 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <motion.div
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: 90 }}
                            className="h-6 w-6 bg-gradient-to-tr from-neon-cyan to-accent-violet rounded-full"
                        />
                        <span className="font-display font-bold tracking-[0.2em] text-lg">
                            ANUU<span className="text-neon-cyan">_VERSE</span>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase text-gray-400">
                        <a href="#" className="hover:text-neon-cyan transition-colors">Repository</a>
                        <a href="#" className="hover:text-neon-cyan transition-colors">Protocols</a>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/20 bg-white/5 text-xs font-mono text-gray-500">
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
