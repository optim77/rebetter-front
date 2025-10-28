import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Star } from "lucide-react";
import { t } from "i18next";
import type { Company } from "@/api/companiesApi.ts";

interface Props {
    data?: Company;
}

export default function MediaAddress({data}: Props) {
    if (!data) return <></>;
    return (
        <>
            <Card className="w-full shadow-sm border border-gray-200 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        {t("companies.your_links")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <Star className="w-6 h-6 text-yellow-500"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t("companies.google")}</p>
                            <p className="text-xl font-semibold text-gray-800">{data.google_review_link}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}