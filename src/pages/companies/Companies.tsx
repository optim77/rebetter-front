import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { companiesApi, type Company } from "@/api/companiesApi.ts";

export default function Companies() {
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["companies", search],
        queryFn: () => companiesApi.getCompanies({ search_term: search }),
    });

    if (isLoading) return <p>{t("action.loading")}</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t("companies.companies")}</h1>
                <Link to='/dashboard/create_company'>
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" /> {t("companies.add_company")}
                    </Button>
                </Link>
            </div>

            <Input
                placeholder={t("action.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.items && data?.items.map((c: Company) => (
                    <Link to={`/dashboard/company/${c.id}`}>
                        <div key={c.id} className="p-4 border rounded-xl bg-white shadow-sm">
                            <h2 className="text-lg font-semibold">{c.name}</h2>
                            <p className="text-gray-500 text-sm">{c.description}</p>
                        </div>
                    </Link>

                ))}
            </div>
        </div>
    );
}
