import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const images = [
    '/assets/vision/anuu_awakening_1769363783186.png',
    '/assets/vision/anuu_orchestration_1769363800045.png',
    '/assets/vision/anuu_integration_1769363814193.png',
    '/assets/vision/anuu_protection_1769363876851.png',
    '/assets/vision/anuu_evolution_1769363892318.png'
];

const titles = [
    "PROTOCOL 141914: AWAKENING",
    "SYSTEM CORE: ORCHESTRATION",
    "DATA HARMONICS: INTEGRATION",
    "SHIELD MATRIX: PROTECTION",
    "FINAL STATE: ASCENSION"
];

const AnuuVision = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev === images.length - 1) {
                    // End of sequence
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 6000); // 6 seconds per slide

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden z-[100] font-mono cursor-none">
            {/* Background Image Layer with Ken Burns Effect */}
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={img}
                        alt={`Anuu Vision ${index}`}
                        className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === currentIndex ? 'scale-110' : 'scale-100'
                            }`}
                    />
                </div>
            ))}

            {/* Overlay UI Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

                {/* Text Overlay */}
                <div className="absolute bottom-20 left-10 text-white">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                        {titles[currentIndex]}
                    </h1>
                    <div className="h-1 w-24 bg-purple-500 mb-4 animate-pulse"></div>
                    <p className="text-sm text-purple-300 opacity-80 typing-effect">
             > PROCESSING NEURAL STREAM... PACKET_{currentIndex + 104}_ZF
                    </p>
                </div>

                {/* Top Status Bar */}
                <div className="absolute top-10 right-10 flex flex-col items-end text-xs text-purple-400 font-bold tracking-widest gap-1">
                    <div>REC ● [ 00:00:{String((currentIndex * 6) + 2).padStart(2, '0')} ]</div>
                    <div>ISO: 161914</div>
                    <div>ANUSET_CORE_V4.2</div>
                </div>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 ring-inset ring-[100px] ring-black/20"></div>
        </div>
    );
};

export default AnuuVision;
