import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { t } from "i18next";
import { clientsApi } from "@/api/clientsApi.ts";
import { ClientMessagesList } from "@/components/client/ClientMessagesList.tsx";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company_id: string;
}

export default function Client() {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();
    const { data: userData, isLoading: isLoadingUser, isError: isErrorUser } = useQuery({
        queryKey: ["client", companyId, clientId],
        queryFn: async (): Promise<Client> => {
            if (!companyId || !clientId) throw new Error("Companies not found!");
            return clientsApi.getClient(companyId, clientId);
        },
        enabled: !!companyId && !!clientId,
    });

    if (isLoadingUser) return <p>{t("action.loading")}</p>;
    if (isErrorUser || !userData) return <p>{t("errors.client_not_found")}</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/company/${companyId}/clients`}>
                        <Button className="mt-2 cursor-pointer" variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t("action.back")}
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                </div>
            </div>

            <Card className="text-center">
                <CardContent className="space-y-3 pt-6">
                    <div>
                        <p className="text-sm text-gray-500">{t("clients.email")}</p>
                        <p className="font-medium">{userData.email || "-"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">{t("clients.phone")}</p>
                        <p className="font-medium">{userData.phone || "-"}</p>
                    </div>

                    <div className="flex items-center gap-2 justify-end">

                        <Link to={`send_sms`}>{t("messages.send_sms_message")}</Link>
                        <Button>{t("action.edit")}</Button>
                        <Button variant="destructive">{t("action.delete")}</Button>
                    </div>
                </CardContent>
            </Card>

            <ClientMessagesList />
        </div>
    );
}
