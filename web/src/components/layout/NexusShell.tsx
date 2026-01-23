import React from 'react';

interface NexusShellProps {
    leftPanel: React.ReactNode;
    centerPanel: React.ReactNode;
    rightPanel: React.ReactNode;
}

export const NexusShell: React.FC<NexusShellProps> = ({ leftPanel, centerPanel, rightPanel }) => {
    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden font-inter selection:bg-cyan-500/30">

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#1a0b2e_0%,_#000000_100%)] opacity-80 pointer-events-none" />
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent z-50 mix-blend-screen" />

            {/* Main Grid */}
            <div className="relative z-10 flex w-full h-full p-4 gap-4">

                {/* Left Column: The Oracle */}
                <section className="w-1/4 h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden glass-panel">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-sm font-orbitron tracking-widest text-cyan-400 uppercase">Oracle</h2>
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]" />
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        {leftPanel}
                    </div>
                </section>

                {/* Center Column: The Feed (Surface) */}
                <section className="w-2/4 h-full flex flex-col relative">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

                    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                        <div className="min-h-[100px]" /> {/* Spacer top */}
                        {centerPanel}
                        <div className="min-h-[200px]" /> {/* Spacer bottom */}
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
                </section>

                {/* Right Column: Context */}
                <section className="w-1/4 h-full flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden glass-panel">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Context Matrix</h2>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {rightPanel}
                    </div>
                </section>

            </div>
        </div>
    );
};
