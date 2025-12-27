import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Star, Globe, Facebook, Instagram, Linkedin, Video } from "lucide-react";
import { t } from "i18next";
import type { Company } from "@/api/companiesApi.ts";
import { ExternalLink } from "lucide-react";
import { type JSX } from "react";

interface Props {
    data?: Company;
}

const socialIcons: Record<string, { icon: JSX.Element; color: string }> = {
    googleReviewLink: { icon: <Star className="w-6 h-6" />, color: "yellow" },
    facebookUrl: { icon: <Facebook className="w-6 h-6" />, color: "blue" },
    instagramUrl: { icon: <Instagram className="w-6 h-6" />, color: "pink" },
    linkedinUrl: { icon: <Linkedin className="w-6 h-6" />, color: "blue" },
    tiktokUrl: { icon: <Video className="w-6 h-6" />, color: "black" },
    znanyLekarzUrl: { icon: <Globe className="w-6 h-6" />, color: "green" },
    booksyUrl: { icon: <Globe className="w-6 h-6" />, color: "purple" },
};

const colorClasses = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    pink: "bg-pink-100 text-pink-700",
    black: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
};

export default function MediaAddress({ data }: Props) {
    if (!data) return null;

    const activeLinks = Object.entries(data)
        .filter(([key, value]) => socialIcons[key] && value)
        .map(([key, url]) => ({ key, url: url as string }));

    if (activeLinks.length === 0) {
        return (
            <Card className="h-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-center border border-gray-200">
                <p className="text-gray-500 text-center px-8">Brak dodanych linków do mediów</p>
            </Card>
        );
    }

    return (
        <Card className="h-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="text-2xl font-bold">{t("companies.your_links")}</CardTitle>
            </CardHeader>

            <CardContent className="p-8">
                <div className="space-y-6">
                    {activeLinks.map(({ key, url }) => {
                        const { icon, color } = socialIcons[key];
                        const platformName = key.replace("Url", "").replace("ReviewLink", "");

                        return (
                            <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-5 rounded-2xl bg-white/70 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${colorClasses[color as keyof typeof colorClasses]}`}>
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Link do</p>
                                        <p className="text-xl font-bold text-gray-800 capitalize">{platformName}</p>
                                    </div>
                                </div>
                                <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            </a>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}