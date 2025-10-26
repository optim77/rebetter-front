import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react"

export default function ReviewStats() {
    return (
        <Card className="w-full shadow-sm border border-gray-200 rounded-2xl">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Statystyki opinii
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-6 p-6">
                {/* Średnia ocena */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-yellow-100">
                        <Star className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Średnia ocena</p>
                        <p className="text-xl font-semibold text-gray-800">4.7</p>
                    </div>
                </div>

                {/* Liczba opinii */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100">
                        <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Liczba opinii</p>
                        <p className="text-xl font-semibold text-gray-800">238</p>
                    </div>
                </div>

                {/* Pozytywne opinie */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-green-100">
                        <ThumbsUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pozytywne opinie</p>
                        <p className="text-xl font-semibold text-gray-800">91%</p>
                    </div>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-purple-100">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Trend</p>
                        <p className="text-xl font-semibold text-gray-800">+12%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
