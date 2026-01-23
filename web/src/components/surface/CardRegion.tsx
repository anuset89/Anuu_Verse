import React from 'react';
import { motion } from 'framer-motion';
import { Video, Code, FileText, Maximize2 } from 'lucide-react';

interface CardProps {
    type: 'video' | 'code' | 'insight';
    title: string;
    timestamp: string;
    children: React.ReactNode;
}

const RitualCard: React.FC<CardProps> = ({ type, title, timestamp, children }) => {
    const getIcon = () => {
        switch (type) {
            case 'video': return <Video size={16} className="text-pink-500" />;
            case 'code': return <Code size={16} className="text-cyan-500" />;
            case 'insight': return <FileText size={16} className="text-yellow-500" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'video': return 'hover:border-pink-500/30 border-pink-500/10';
            case 'code': return 'hover:border-cyan-500/30 border-cyan-500/10';
            case 'insight': return 'hover:border-yellow-500/30 border-yellow-500/10';
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative w-full max-w-2xl mx-auto mb-8 bg-black/40 backdrop-blur-md border ${getBorderColor()} rounded-xl overflow-hidden shadow-2xl transition-colors group`}
        >
            {/* Glow Element */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-bl-full`} />

            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-white">{title}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{timestamp} • {type.toUpperCase()}</p>
                    </div>
                </div>
                <button className="text-gray-600 hover:text-white transition-colors">
                    <Maximize2 size={14} />
                </button>
            </div>

            <div className="p-0">
                {children}
            </div>

            {/* Action Footer */}
            <div className="p-3 bg-white/2 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-300">Save</button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-300">Share</button>
            </div>
        </motion.div>
    );
};


export const CardRegion: React.FC = () => {
    return (
        <div className="px-8 pb-32 flex flex-col items-center">
            {/* Example Video Card */}
            <RitualCard type="video" title="Nebula Simulation Loop" timestamp="Just now">
                <div className="aspect-video bg-black relative flex items-center justify-center group/video cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-cyan-900/20" />
                    <span className="text-gray-500 text-xs font-mono">Video Player Placeholder (SVD Output)</span>
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity bg-black/40">
                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur">
                            <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                        </div>
                    </div>
                </div>
            </RitualCard>

            {/* Example Code Card */}
            <RitualCard type="code" title="Hardware Detection Script" timestamp="2 mins ago">
                <div className="bg-[#0d1117] p-4 overflow-x-auto font-mono text-xs text-gray-300">
                    <pre>{`def detect_gpu():
  """Detects AMD GPU and returns detailed info."""
  try:
      # Check for rocminfo
      res = subprocess.run(["rocminfo"], capture_output=True)
      if res.returncode == 0 and "gfx1100" in res.stdout:
         return {"type": "AMD", "model": "RX 7800 XT"}
  except Exception:
      pass`}</pre>
                </div>
            </RitualCard>
        </div>
    );
};
