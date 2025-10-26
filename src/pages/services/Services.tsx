import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { servicesApi } from "@/api/servicesApi.ts";
import { useState } from "react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import type { Client } from "@/api/clientsApi.ts";

export default function Services() {
    const { companyId } = useParams<{ companyId: string }>();
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["services", companyId],
        queryFn: async () => {
            if (!companyId) throw new Error("Companies not found!");
            return servicesApi.getServices(companyId, { search_term: search });
        },
        enabled: !!companyId,
    });

    if (isLoading) return <p>{t("action.loading")}</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t("services.services")}</h1>
                <Link to={`/dashboard/company/${companyId}/create_service`}>
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" /> {t("services.add_service")}
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