/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-space': '#000020',
                'nebula-purple': '#200040',
                'mist-purple': '#400060',
                'neon-cyan': '#00BFFF',
                'accent-violet': '#8A2BE2',
                'glass-bg': 'rgba(20, 0, 40, 0.4)',
                'glass-border': 'rgba(138, 43, 226, 0.3)',
            },
            fontFamily: {
                'display': ['Syncopate', 'sans-serif'],
                'body': ['Outfit', 'sans-serif'],
                'mono': ['Space Mono', 'monospace'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glitch': 'chromatic 4s infinite',
                'nebula': 'nebulaMove 20s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                chromatic: {
                    '0%': { textShadow: '0.05em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.05em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75)' },
                    '14%': { textShadow: '0.05em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.05em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75)' },
                    '15%': { textShadow: '-0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75)' },
                    '49%': { textShadow: '-0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75)' },
                    '50%': { textShadow: '0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 0, 0.75)' },
                    '99%': { textShadow: '0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 0, 0.75)' },
                    '100%': { textShadow: '-0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75)' },
                },
                nebulaMove: {
                    'from': { transform: 'scale(1)' },
                    'to': { transform: 'scale(1.2)' },
                }
            }
        },
    },
    plugins: [],
}
