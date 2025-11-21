import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { SMSMessagesAPI, type UserMessageResponse } from "@/api/SMSMessagesAPI";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";

export const ClientMessagesList = (): JSX.Element => {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messages", companyId, clientId],
        queryFn: async () =>
            SMSMessagesAPI.fetchMessagesForUser(companyId!, clientId!),
        enabled: !!companyId && !!clientId,
    });

    if (isLoading) return <Loader />;
    if (isError) return <ErrorBanner error={error} error_translate={"error_fetching_messages"} />;

    if (!data || data.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-10 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-3 opacity-60" />
                <p>{t("messages.no_sms_messages_for_client")}</p>
            </div>
        );
    }

    const getStatus = (msg: UserMessageResponse) => {
        if (msg.completed && msg.redirect_feedback)
            return { label: t("messages.negative_response"), icon: "❌", variant: "destructive" };

        if (msg.redirect_response === "positiveResponse")
            return { label: t("messages.positive_response"), icon: "💚", variant: "secondary" };

        if (msg.clicked_at && !msg.completed)
            return { label: t("messages.clicked_response"), icon: "🔗", variant: "outline" };

        return { label: t("messages.no_response"), icon: "⏳", variant: "outline" };
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{t("messages.client_messages")}</p>
                <span className="text-sm text-muted-foreground">
                    {t("common.total")}: {data.total}
                </span>
            </div>

            {data.items.map((msg) => {
                const status = getStatus(msg);

                return (
                    <Link to={""}>
                        <Card
                            key={msg.id}
                            className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 mb-5"
                        >
                            <CardContent className="px-4 py-3 flex items-start gap-4">

                                <div className="p-2 rounded-xl bg-secondary/40">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Badge className="text-[10px] px-2 py-0.5" variant="outline">
                                            {msg.messageType.toUpperCase()}
                                        </Badge>

                                        <span className="text-[10px] text-muted-foreground">
                            {format(new Date(msg.send_at), "dd MMM yyyy, HH:mm", { locale: pl })}
                        </span>
                                    </div>

                                    <p className="text-sm leading-tight text-foreground">
                                        {msg.message}
                                    </p>

                                    {msg.redirect_feedback && (
                                        <p className="text-xs text-muted-foreground italic mt-1">
                                            {t("messages.client_opinion")}: “{msg.redirect_feedback}”
                                        </p>
                                    )}

                                    <Badge
                                        variant={status.variant}
                                        className="text-[11px] px-2 py-0.5 mt-1"
                                    >
                                        {status.label} {status.icon}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                );
            })}
        </div>
    );
};
