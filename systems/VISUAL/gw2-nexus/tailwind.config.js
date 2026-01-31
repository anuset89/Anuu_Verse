/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmos: {
                    base: '#050508', // Deep void black
                    void: '#0a0a0f',
                    star: '#e9d5ff',
                    nebula: '#6366f1', // Indigo primary
                    highlight: '#38bdf8', // Cyan highlight
                    gold: '#fbbf24',
                    success: '#10b981',
                    danger: '#fb7185'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
                display: ['Orbitron', 'sans-serif'],
            },
            backgroundImage: {
                'cyber-grid': "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
                'nebula-gradient': "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 15, 0) 70%)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
