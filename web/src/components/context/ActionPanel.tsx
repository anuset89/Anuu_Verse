import React from 'react';
import { Sliders, RefreshCw, Layers } from 'lucide-react';

export const ActionPanel: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-6">

            {/* Active Selection Info */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Active Focus</span>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <h4 className="text-sm text-pink-400 font-medium">Nebula Simulation Loop</h4>
                    <p className="text-xs text-gray-400 mt-1">Video • 4s • 1024x576</p>
                </div>
            </div>

            {/* Contextual Actions */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Manifestation Controls</span>

                <div className="space-y-3">
                    {/* Slider Example */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Motion Bucket ID</span>
                            <span>127</span>
                        </div>
                        <input type="range" className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500" />
                    </div>

                    {/* Buttons */}
                    <button className="w-full py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/50 rounded flex items-center justify-center gap-2 text-xs text-gray-300 transition-all">
                        <RefreshCw size={12} />
                        Regenerate Variation
                    </button>
                    <button className="w-full py-2 bg-white/5 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/50 rounded flex items-center justify-center gap-2 text-xs text-gray-300 transition-all">
                        <Layers size={12} />
                        Upscale (2x)
                    </button>
                </div>
            </div>

            {/* System Vitals */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 block">System Vitals</span>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-black/40 rounded border border-white/5 text-center">
                        <div className="text-xs text-gray-500">VRAM</div>
                        <div className="text-sm text-cyan-400">12.4 GB</div>
                    </div>
                    <div className="p-2 bg-black/40 rounded border border-white/5 text-center">
                        <div className="text-xs text-gray-500">GPU</div>
                        <div className="text-sm text-pink-400">98%</div>
                    </div>
                </div>
            </div>

        </div>
    );
};
