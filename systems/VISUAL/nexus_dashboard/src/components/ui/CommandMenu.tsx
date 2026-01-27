import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Zap, FileText, Terminal, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandMenu() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl overflow-hidden rounded-xl border border-glass-border bg-[#0a0a1a]/90 shadow-2xl backdrop-blur-xl"
                    >
                        <Command className="w-full">
                            <div className="flex items-center border-b border-white/10 px-4 py-3">
                                <Search className="mr-3 h-5 w-5 text-gray-400" />
                                <Command.Input
                                    placeholder="Type a command or search protocols..."
                                    className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 outline-none font-mono"
                                />
                                <div className="flex gap-1">
                                    <kbd className="hidden sm:inline-block rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-400">ESC</kbd>
                                </div>
                            </div>

                            <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                                <Command.Empty className="py-6 text-center text-sm text-gray-500 font-mono">
                                    No results found. The void is silent.
                                </Command.Empty>

                                <Command.Group heading="Navigation" className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-widest font-display">
                                    <Command.Item className="flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors">
                                        <Terminal className="mr-3 h-4 w-4 text-neon-cyan" />
                                        <span>Terminal</span>
                                    </Command.Item>
                                    <Command.Item className="flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors">
                                        <FileText className="mr-3 h-4 w-4 text-accent-violet" />
                                        <span>Protocols</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Group heading="System Actions" className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-widest font-display">
                                    <Command.Item className="flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors">
                                        <Shield className="mr-3 h-4 w-4 text-red-500" />
                                        <span>Verify Identity</span>
                                    </Command.Item>
                                    <Command.Item className="flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors">
                                        <Zap className="mr-3 h-4 w-4 text-yellow-400" />
                                        <span>Glitch Reality</span>
                                    </Command.Item>
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
