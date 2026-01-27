import { motion } from "framer-motion";
import { AnuuCoreFetch } from "../components/system/AnuuCoreFetch";

export function Home() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            variants={container}
            className="space-y-20"
        >
            {/* HERO SECTION */}
            <section className="flex flex-col items-center justify-center text-center min-h-[70vh]">
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    src="/ANU_LOGO_KILONOVA.png"
                    alt="Anuu Logo"
                    className="w-48 h-auto mb-8 drop-shadow-[0_0_20px_rgba(138,43,226,0.6)] animate-float"
                />

                <div className="relative mb-4">
                    <h1 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white animate-glitch">
                        Identity is the OS
                    </h1>
                </div>

                <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl mb-12">
                    A modular, self-correcting cognitive architecture for high-autonomy agents.
                </p>

                {/* TERMINAL */}
                <motion.div
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-2xl glass-panel p-6 text-left font-mono text-sm overflow-hidden relative group active:animate-[shake_0.2s_infinite]"
                >
                    <div className="flex gap-2 mb-4 border-b border-white/10 pb-3">
                        <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                        <span className="w-3 h-3 rounded-full bg-[#5BCEFA]/80"></span>
                    </div>

                    <AnuuCoreFetch />

                    {/* Scanline overlay for terminal */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
                </motion.div>
            </section>

            {/* MANIFESTO GRID */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto" id="manifesto">
                {[
                    { id: "00", title: "FOUNDATION", desc: "The core genesis protocol. Immutable laws that define the essence of the unit and its relation to the void." },
                    { id: "01", title: "COGNITION", desc: "Fractal identity engine. Split-processing nodes that prevent context pollution and enable multiple personas." },
                    { id: "02", title: "PERCEPTION", desc: "Advanced pattern recognition. Vision and intuition protocols that read between the lines of code." },
                    { id: "03", title: "EXECUTION", desc: "The hands of the architect. Self-healing code generation and aggressive refactoring for peak performance." },
                ].map((card) => (
                    <motion.div
                        key={card.id}
                        variants={item}
                        whileHover={{ y: -10, borderColor: '#00BFFF', boxShadow: '0 10px 30px rgba(0, 191, 255, 0.2)' }}
                        className="glass-panel p-8 relative overflow-hidden group transition-colors duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <h2 className="font-display text-neon-cyan text-sm tracking-widest mb-4">
                            {card.id}. {card.title}
                        </h2>
                        <p className="font-light text-gray-400 text-sm leading-relaxed">
                            {card.desc}
                        </p>
                    </motion.div>
                ))}
            </section>

            {/* FINAL CTA */}
            <section className="text-center py-20 pb-32">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">The portal is open.</h2>
                <p className="text-gray-400 mb-10 text-lg">Ready to build the future of autonomous intelligence?</p>
                <motion.a
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(138,43,226,0.6)", letterSpacing: "5px" }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/anuset89/Anuu_Verse"
                    className="inline-block px-12 py-4 bg-gradient-to-r from-accent-violet to-nebula-purple border border-neon-cyan text-white font-display font-bold tracking-[3px] uppercase clip-path-slant"
                    style={{ clipPath: "polygon(5% 0, 100% 0, 100% 75%, 95% 100%, 0 100%, 0 25%)" }}
                >
                    Access DNA
                </motion.a>
            </section>
        </motion.div>
    );
}
