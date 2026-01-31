/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                anuu: {
                    void: '#0a0a0a',
                    core: '#18181b', // zinc-900
                    border: '#3f3f46',
                    purple: '#c084fc', // purple-400
                    fuchsia: '#e879f9', // fuchsia-400
                    gold: '#fbbf24', // amber-400
                    danger: '#ef4444',
                    success: '#34d399'
                }
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
