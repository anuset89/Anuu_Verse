import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DocViewer } from "../components/DocViewer";
import { FileText, ChevronRight, Book } from "lucide-react";

const DOCUMENTS = [
    { title: "Readme (Genesis)", path: "README.md" },
    { title: "Contributing Protocol", path: "CONTRIBUTING.md" },
    { title: "Visual Analysis", path: "Assets/ANUU_VISUAL_ANALYSIS.md" },
    { title: "Pull Request Template", path: ".github/pull_request_template.md" },
    { title: "License", path: "LICENSE" }
];

export function Protocols() {
    const [activeDoc, setActiveDoc] = useState(DOCUMENTS[0]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row gap-8 min-h-[80vh]"
        >
            {/* SIDEBAR */}
            <div className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                    <div>
                        <h2 className="flex items-center gap-2 text-neon-cyan font-display font-bold text-sm tracking-widest uppercase mb-4">
                            <Book className="w-4 h-4" /> Library Index
                        </h2>
                        <div className="space-y-1">
                            {DOCUMENTS.map((doc) => (
                                <button
                                    key={doc.path}
                                    onClick={() => setActiveDoc(doc)}
                                    className={`w-full text-left px-4 py-3 rounded text-sm transition-all duration-300 flex items-center justify-between group ${activeDoc.path === doc.path
                                            ? "bg-white/10 text-white border-l-2 border-neon-cyan"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className="truncate">{doc.title}</span>
                                    {activeDoc.path === doc.path && (
                                        <ChevronRight className="w-3 h-3 text-neon-cyan" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded border border-glass-border bg-glass-bg/50 text-xs text-gray-500 font-mono">
                        <p>STATUS: CONNECTED</p>
                        <p>SOURCE: origin/main</p>
                        <p>SYNC: REALTIME</p>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDoc.path}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="glass-panel p-8 md:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <FileText className="w-24 h-24 text-white/5" />
                        </div>

                        <div className="mb-8 border-b border-white/10 pb-4">
                            <h3 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-1">
                                Reading Protocol:
                            </h3>
                            <p className="text-neon-cyan font-mono text-sm">
                                {activeDoc.path}
                            </p>
                        </div>

                        <DocViewer
                            owner="anuset89"
                            repo="Anuu_Verse"
                            path={activeDoc.path}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
