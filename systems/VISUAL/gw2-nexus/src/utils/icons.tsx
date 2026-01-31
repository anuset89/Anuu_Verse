
export const getItemIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("blood")) return "🩸";
    if (n.includes("bone")) return "☠️";
    if (n.includes("claw")) return "🦅";
    if (n.includes("fang")) return "🦷";
    if (n.includes("scale")) return "🛡️";
    if (n.includes("totem")) return "🗿";
    if (n.includes("venom")) return "🐍";
    if (n.includes("dust") || n.includes("lucent")) return "✨";
    if (n.includes("ore") || n.includes("mithril") || n.includes("orichalcum")) return "⛏️";
    if (n.includes("wood")) return "🪵";
    if (n.includes("leather")) return "🐄";
    if (n.includes("silk") || n.includes("cloth") || n.includes("gossamer")) return "🧵";
    if (n.includes("rune") || n.includes("shard")) return "💠";
    return "📦";
};
