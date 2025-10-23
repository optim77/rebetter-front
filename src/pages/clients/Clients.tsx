import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import { type Client, clientsApi } from "@/api/clientsApi.ts";

export default function Clients() {
    const { companyId } = useParams<{ companyId: string }>();
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["clients", companyId, search],
        queryFn: () => clientsApi.getClients(companyId!, { search_term: search }),
        enabled: !!companyId,
    });

    if (isLoading) return <p>{t("action.loading")}</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t("clients.clients")}</h1>
                <Link to={`/dashboard/company/${companyId}/create_client`}>
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" /> {t("clients.add_client")}
                    </Button>
                </Link>
            </div>

            <Input
                placeholder={t("action.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data && data?.data.items.map((c: Client) => (
                    <Link to={`/dashboard/company/${c.company_id}/client/${c.id}`}>
                        <div key={c.id} className="p-4 border rounded-xl bg-white shadow-sm">
                            <h2 className="text-lg font-semibold">{c.name}</h2>
                            <p className="text-gray-500 text-sm">{c.email}</p>
                        </div>
                    </Link>

                ))}
            </div>
        </div>
    );
}
