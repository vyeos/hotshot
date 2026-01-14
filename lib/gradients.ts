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
