import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import { type Client, clientsApi } from "@/api/ClientsApi.ts";
import { NoFoundClients } from "@/components/client/elements/NoFoundClients.tsx";
import { Pagination } from "@/components/pagination/Pagination.tsx";
import { ClientCardList } from "@/components/client/elements/ClientCardList.tsx";
import { DEFAULT_PAGE_SIZE } from "@/components/pagination/consts.ts";
import { PageSizeChange } from "@/components/pagination/PageSizeChange.tsx";
import { BaseSearchInput } from "@/components/elements/BaseSearchInput.tsx";


export default function Clients() {
    const {groupId} = useParams<{ groupId: string }>();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const {data, isLoading} = useQuery({
        queryKey: ["clients", groupId, search, page, pageSize],
        queryFn: async () => {
            return await clientsApi.getClients(groupId!, {
                search_term: search,
                page,
                size: pageSize,
            });
        },
        enabled: !!groupId,
        placeholderData: keepPreviousData,
    });

    const clients = data?.items || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handlePageSizeChange = (newSize: string) => {
        const sizeNum = Number(newSize);
        setPageSize(sizeNum);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-muted-foreground">{t("action.loading")}...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("clients.clients")}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {total === 0
                            ? t("clients.no_clients")
                            : `${total} ${total === 1 ? t("clients.client") : t("clients.clients")}`}
                    </p>
                </div>

                <Button asChild size="sm">
                    <Link to={`/dashboard/group/${groupId}/create_client`}>
                        <Plus className="mr-2 h-4 w-4"/>
                        {t("clients.add_client")}
                    </Link>
                </Button>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <BaseSearchInput search={search} handleSearchChange={handleSearchChange} />
                <PageSizeChange handlePageSizeChange={handlePageSizeChange} pageSize={pageSize} />
            </div>

            {clients.length > 0 ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {clients.map((client: Client) => (
                            <ClientCardList groupId={groupId} client={client} key={client.id} />
                        ))}
                    </div>
                    <Pagination totalPages={totalPages} pageSize={pageSize} total={total} page={page}
                                handlePageChange={handlePageChange}/>
                </>
            ) : (
                <NoFoundClients groupId={groupId}/>
            )}
        </div>
    );
}