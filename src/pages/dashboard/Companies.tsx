import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "@/api/companies.ts";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

export default function Companies() {
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["companies", search],
        queryFn: () => getCompanies({ search_term: search }),
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Companies</h1>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Company
                </Button>
            </div>

            <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.data.map((c: any) => (
                    <div key={c.id} className="p-4 border rounded-xl bg-white shadow-sm">
                        <h2 className="text-lg font-semibold">{c.name}</h2>
                        <p className="text-gray-500 text-sm">{c.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
