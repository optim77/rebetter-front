import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/api/companiesApi";
import { useParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";

interface Props {
    onSelect?: (data: { social: string; url: string }) => void;
}

export const SocialLinksForMessageSelector = ({ onSelect }: Props) => {
    const { companyId } = useParams<{ companyId: string }>();

    const { data: socials, isLoading, isError } = useQuery({
        queryKey: ["companySocials", companyId],
        queryFn: async () => {
            if (!companyId) throw new Error("Missing companyId");
            return companiesApi.getSocials(companyId);
        },
        enabled: !!companyId,
    });

    if (isLoading) {
        return <p>{t("action.loading")}...</p>;
    }

    if (isError || !socials) {
        return <p className="text-red-500">{t("errors.data_loading_failed")}</p>;
    }

    const activeSocials = Object.entries(socials).filter(([_, value]) => !!value);

    if (activeSocials.length === 0) {
        return <p className="text-gray-500 text-sm">{t("company.no_socials_available")}</p>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-md">
            <h2 className="text-lg font-semibold mb-4">
                {t("companies.choose_social_platform")}
            </h2>

            <RadioGroup
                className="space-y-3"
                onValueChange={(val) => {
                    const [social, url] = val.split("|");
                    onSelect?.({ social, url });
                }}
            >
                {activeSocials.map(([key, url], index) => (
                    <div
                        key={key}
                        className="flex items-center justify-between border rounded-xl px-3 py-2 hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value={`${key}|${url}`} id={`social-${index}`} />
                            <Label htmlFor={`social-${index}`} className="capitalize">
                                {key.replace("_", " ")}
                            </Label>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={() => window.open(url || "", "_blank")}
                        >
                            <ExternalLink className="h-4 w-4" />
                            {t("action.open")}
                        </Button>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};
