import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { t } from "i18next";
import api from "@/api/axios";

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company_id: string;
}

export default function Client() {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["client", companyId, clientId],
        queryFn: async (): Promise<Client> => {
            const res = await api.get(`/clients/${companyId}/${clientId}`);
            return res.data;
        },
        enabled: !!companyId && !!clientId,
    });

    if (isLoading) return <p>{t("action.loading")}</p>;
    if (isError || !data) return <p>{t("error.client_not_found")}</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/company/${companyId}/clients`}>
                        <Button className="mt-2" variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t("action.back")}
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                </div>
            </div>

            <Card className="text-center">
                <CardContent className="space-y-3 pt-6">
                    <div>
                        <p className="text-sm text-gray-500">{t("clients.email")}</p>
                        <p className="font-medium">{data.email || "-"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">{t("clients.phone")}</p>
                        <p className="font-medium">{data.phone || "-"}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <Button>{t("action.edit")}</Button>
                        <Button variant="destructive">{t("action.delete")}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
