import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { GroupsApi, type Group } from "@/api/GroupsApi.ts";
import { BaseSearchInput } from "@/components/elements/BaseSearchInput.tsx";
import { GroupTile } from "@/components/group/GroupTile.tsx";
import { NoFoundGroups } from "@/components/group/NoFoundGroups.tsx";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";

export default function Groups() {
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["groups", search],
        queryFn: () => GroupsApi.getGroups({ search_term: search }),
    });

    const groups = data?.items ?? [];
    const total = data?.total ?? 0;

    if (isLoading) return <BaseSpinner />

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("groups.groups")}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {total === 0
                            ? t("groups.no_groups")
                            : `${total} ${total === 1 ? t("groups.group_one") : t("groups.groups_found")}`}
                    </p>
                </div>

                <Button asChild size="sm">
                    <Link to="/dashboard/create_group">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("groups.add_company")}
                    </Link>
                </Button>
            </div>

            <div className="relative mb-10 max-w-md">
                <BaseSearchInput search={search} handleSearchChange={(e) => setSearch(e.target.value)} />
            </div>

            {groups.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groups.map((group: Group) => (
                        <GroupTile group={group} />
                    ))}
                </div>
            ) : (
                <NoFoundGroups />
            )}
        </div>
    );
}