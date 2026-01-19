import { type JSX, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MessagesAPI } from "@/api/MessagesAPI.ts";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import { ErrorBanner } from "@/components/elements/ErrorBanner";
import { Pagination } from "@/components/pagination/Pagination.tsx";
import { ClientMessageTile } from "@/components/messages/ClientMessageTile.tsx";
import { NoFoundMessages } from "@/components/messages/elements/NoFoundMessages.tsx";
import { DEFAULT_PAGE_SIZE } from "@/components/pagination/consts.ts";
import { PageSizeChange } from "@/components/pagination/PageSizeChange.tsx";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";

export const ClientMessagesList = (): JSX.Element => {
    const { groupId, clientId } = useParams<{ groupId: string; clientId: string }>();
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [page, setPage] = useState(1);

    const {
        data,
        isLoading,
        isError,
        isPlaceholderData,
        error,
    } = useQuery({
        queryKey: ["messages", groupId, clientId, page],
        queryFn: async () => MessagesAPI.fetchMessagesForUser(groupId!, clientId!, page),
        enabled: !!groupId && !!clientId,
        placeholderData: keepPreviousData,
    });

    if (isLoading && !isPlaceholderData) return <BaseSpinner />;
    if (isError) return <ErrorBanner error={error} error_translate="error_fetching_messages" />;

    if (!data || data.items.length === 0) {
        return (
            <NoFoundMessages />
        );
    }

    const handlePageSizeChange = (newSize: string) => {
        const sizeNum = Number(newSize);
        setPageSize(sizeNum);
        setPage(1);
    };

    const totalPages = Math.ceil(data.total / pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between opacity-80 ">
                <h2 className="text-xl font-semibold tracking-tight">
                    {t("messages.client_messages")}
                </h2>

                <Badge variant="secondary" className="text-sm">
                    {data.total} {t("messages.messages_counter")}
                </Badge>
            </div>

            <div className="space-y-4">
                {data.items.map((msg) => (
                    <ClientMessageTile key={msg.id} msg={msg}  />
                ))}
            </div>

            <Pagination totalPages={totalPages} pageSize={pageSize} total={data.total} page={page} handlePageChange={setPage} />
            <PageSizeChange handlePageSizeChange={handlePageSizeChange} pageSize={pageSize} />
        </div>
    );
};