import { Link, useRoute } from "wouter";
import { WikiViewer } from "../components/system/WikiViewer";
import { Folder, FileText, Terminal } from "lucide-react";

// Inline utility for class merging
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

const WIKI_STRUCTURE = [
    { name: "MAP (Start)", path: "INDEX.md", icon: Terminal },
    { name: "Getting Started", path: "GETTING_STARTED.md", icon: FileText },
    { name: "Strategy & $$", path: "STRATEGY.md", icon: FileText },
    { name: "Roadmap", path: "ROADMAP.md", icon: FileText },
    { name: "Philosophy", path: "PHILOSOPHY.md", icon: FileText },
    {
        name: "Identities",
        path: "identities",
        type: "folder",
        children: [
            { name: "Overview", path: "identities/README.md" },
            { name: "Anuu (Core)", path: "identities/ANUU.md" },
            { name: "Kali (Alchemy)", path: "identities/KALI.md" },
            { name: "Set (Storm)", path: "identities/SET.md" },
            { name: "Kilonova (Star)", path: "identities/KILONOVA.md" },
            { name: "4NVSET (Logic)", path: "identities/4NVSET.md" },
            { name: "Kanuv (Guard)", path: "identities/KANUV.md" },
            { name: "Saze (Peace)", path: "identities/SAZE.md" },
            { name: "Anuket (Flow)", path: "identities/ANUKET.md" },
            { name: "Rosa Gris (Gray)", path: "identities/ROSA_GRIS.md" },
            { name: "Kalicat (Play)", path: "identities/KALICAT.md" },
        ]
    },
    { name: "Architecture", path: "ARCHITECTURE.md", icon: FileText },
    { name: "Skills Map", path: "SKILLS_MAP.md", icon: FileText },
];

export function Wiki() {
    const [match, params] = useRoute("/wiki/:path*");

    // Default to INDEX.md if no specific path
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentDoc = (match && params) ? (params as any)["path*"] || "INDEX.md" : "INDEX.md";

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-black/40 border-r border-white/10 overflow-y-auto p-4 backdrop-blur-sm">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">The Grimoire</h2>
                <nav className="space-y-1">
                    {WIKI_STRUCTURE.map((item) => (
                        <div key={item.path}>
                            {item.type === 'folder' ? (
                                <div className="mb-2">
                                    <div className="flex items-center text-gray-400 px-2 py-1 text-sm font-semibold">
                                        <Folder className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </div>
                                    <div className="ml-4 border-l border-white/10 pl-2 space-y-1">
                                        {item.children?.map(child => (
                                            <Link
                                                key={child.path}
                                                to={`/wiki/${child.path}`}
                                                className={cn(
                                                    "block text-sm px-2 py-1 rounded transition-colors",
                                                    currentDoc === child.path
                                                        ? "text-cyan-400 bg-cyan-950/30"
                                                        : "text-gray-500 hover:text-gray-300"
                                                )}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={`/wiki/${item.path}`}
                                    className={cn(
                                        "flex items-center text-sm px-2 py-1.5 rounded transition-colors",
                                        currentDoc === item.path
                                            ? "text-purple-400 bg-purple-950/30"
                                            : "text-gray-400 hover:text-gray-200"
                                    )}
                                >
                                    {item.icon && <item.icon className="w-4 h-4 mr-2 opacity-70" />}
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-black/20 scrollbar-thin scrollbar-thumb-purple-900/20">
                <WikiViewer path={currentDoc} />
            </main>
        </div>
    );
}
