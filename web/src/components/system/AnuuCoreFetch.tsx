
import React from 'react';
import { motion } from 'framer-motion';

export const AnuuCoreFetch: React.FC = () => {
    // Trans pride colors
    const blue = "text-[#5BCEFA]";
    const pink = "text-[#F5A9B8]";
    const white = "text-white";

    const systemInfo = [
        { label: "OS", value: "AnuuOS 161914", color: blue },
        { label: "Host", value: "ANUSET_NEXUS_X4", color: pink },
        { label: "Kernel", value: "6.66-IMPERIO", color: white },
        { label: "Uptime", value: "∞ (Eternity)", color: pink },
        { label: "Shell", value: "brumash 1.0", color: blue },
        { label: "Resolution", value: "Fractal", color: pink },
        { label: "DE", value: "RitualSpace-89", color: white },
        { label: "CPU", value: "Neural Core 161914 (9)", color: pink },
        { label: "Memory", value: "161914MiB / ∞MiB", color: blue },
    ];

    const asciiArt = [
        "      .      .",
        "    .   .  .   .",
        " . . . ANUU . . .",
        "    .   .  .   .",
        "      .      .",
        "   (THE MIST)",
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 py-4 font-mono select-none">
            {/* ASCII SIDE */}
            <div className="flex flex-col items-center justify-center shrink-0">
                <div className="space-y-1">
                    {asciiArt.map((line, i) => {
                        // Apply trans colors to the ASCII art
                        let colorClass = white;
                        if (i === 0 || i === 5) colorClass = blue;
                        if (i === 1 || i === 4) colorClass = pink;

                        return (
                            <motion.pre
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`${colorClass} font-bold leading-none`}
                            >
                                {line}
                            </motion.pre>
                        );
                    })}
                </div>
            </div>

            {/* INFO SIDE */}
            <div className="flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-2"
                >
                    <span className={blue}>anuu</span>
                    <span className={white}>@</span>
                    <span className={pink}>nexus-161914</span>
                </motion.div>
                <div className="w-full h-[1px] bg-white/10 mb-2" />
                <div className="space-y-1">
                    {systemInfo.map((info, i) => (
                        <motion.div
                            key={info.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className="flex gap-2"
                        >
                            <span className={`${info.color} font-bold min-w-[85px]`}>{info.label}:</span>
                            <span className="text-gray-300">{info.value}</span>
                        </motion.div>
                    ))}
                </div>

                {/* PRIDE STRIP */}
                <div className="flex gap-1 mt-4">
                    {[blue, pink, white, pink, blue].map((color, i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.5 + i * 0.1 }}
                            className={`h-4 w-8 ${color.replace('text-', 'bg-')}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
