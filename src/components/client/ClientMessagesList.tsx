import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { SMSMessagesAPI } from "@/api/SMSMessagesAPI";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { Loader } from "@/components/elements/Loader.tsx";
import { ErrorBanner } from "@/components/elements/ErrorBanner.tsx";
import type { Message } from "@/api/Types.ts";


export const ClientMessagesList = (): JSX.Element => {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messages", companyId, clientId],
        queryFn: async (): Promise<{ items: Message[]; total: number }> => {
            if (!companyId || !clientId) throw new Error("Missing company or client ID!");
            return SMSMessagesAPI.fetchMessagesForUser(companyId, clientId);
        },
        enabled: !!companyId && !!clientId,
    });
    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <ErrorBanner error={error} error_translate={'error_fetching_messages'} />
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-10 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-3 opacity-60" />
                <p>{t("messages.no_sms_messages_for_client")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-2xl font-bold">{t("messages.client_messages")}</p>
            {data.items.map((msg) => (
                <Card key={msg.id} className="shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Badge variant="outline">{msg.messageType}</Badge>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(msg.send_at), "dd MMM yyyy, HH:mm", { locale: pl })}
                            </span>
                        </div>
                        <div className="ml-2">
                            <p className="text-sm text-foreground mt-2">{msg.message}</p>

                            {msg.feedback && (
                                <p className="text-xs text-muted-foreground italic mt-2">
                                    {t("messages.client_opinion")}: “{msg.feedback}”
                                </p>
                            )}
                            <Badge
                                variant={
                                    msg.responded === "positiveResponse"
                                        ? "secondary"
                                        : msg.responded === "negativeResponse"
                                            ? "destructive"
                                            : msg.responded === "messageClicked"
                                                ? "outline"
                                                : "secondary"
                                }
                                className="mt-2"
                            >
                                {msg.responded === "positiveResponse" && `${t("messages.positive_response")} 💚`}
                                {msg.responded === "negativeResponse" && `${t("messages.negative_response")} ❌`}
                                {msg.responded === "messageClicked" && `${t("messages.clicked_response")} 🔗`}
                                {!msg.responded && `${t("messages.no_response")} ⏳`}
                            </Badge>
                        </div>

                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
