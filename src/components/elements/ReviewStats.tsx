import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewStats() {
    // Tymczasowe dane – w przyszłości możesz przekazać je jako props
    const stats = [
        { label: "Średnia ocena", value: "4.7", icon: Star, color: "yellow" },
        { label: "Liczba opinii", value: "238", icon: MessageSquare, color: "blue" },
        { label: "Pozytywne opinie", value: "91%", icon: ThumbsUp, color: "green" },
        { label: "Trend (miesiąc)", value: "+12%", icon: TrendingUp, color: "purple" },
    ];

    const colorClasses = {
        yellow: "bg-yellow-100 text-yellow-600",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600",
    };

    return (
        <Card className="h-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="text-2xl font-bold">Statystyki opinii</CardTitle>
            </CardHeader>

            <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-5"
                        >
                            <div className={`p-5 rounded-2xl ${colorClasses[stat.color as keyof typeof colorClasses]} shadow-lg`}>
                                <stat.icon className="w-10 h-10" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}