
export const GoldDisplay = ({ amount, size = "md" }: { amount: number, size?: "sm" | "md" | "lg" | "xl" }) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const g = Math.floor(absAmount / 10000);
    const s = Math.floor((absAmount % 10000) / 100);
    const c = Math.floor(absAmount % 100);
    const sizeClasses = { "sm": "text-[10px]", "md": "text-[10px] md:text-sm", "lg": "text-xl", "xl": "text-3xl" };
    return (
        <div className={`font-mono font-bold flex items-baseline gap-1 ${sizeClasses[size]} ${isNegative ? 'text-red-400' : ''}`}>
            {isNegative && <span>-</span>}
            <span className={isNegative ? 'text-red-400' : 'text-amber-400'}>{g}g</span>
            <span className="text-zinc-400">{s}s</span>
            {size !== "xl" && <span className="text-amber-700">{c}c</span>}
        </div>
    );
};
