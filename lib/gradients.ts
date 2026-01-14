export const getDropTitleGradient = (count: number): string => {
    switch (count) {
        case 5:
            return "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600";
        case 4:
            return "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500";
        case 3:
            return "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600";
        case 2:
            return "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600";
        default:
            return "bg-gradient-to-r from-slate-300 via-gray-400 to-zinc-500";
    }
};

export const getDropImageGlow = (count: number): string => {
    switch (count) {
        case 5:
            return "hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]";
        case 4:
            return "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"; // Purple-500
        case 3:
            return "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"; // Cyan-500
        case 2:
            return "hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"; // Emerald-500
        default:
            return "hover:shadow-[0_0_20px_rgba(113,113,122,0.3)]"; // Zinc-500
    }
};
