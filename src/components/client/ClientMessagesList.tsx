import { type JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { SMSMessagesAPI, type UserMessageResponse } from "@/api/SMSMessagesAPI";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

interface StatusInfo {
    label: string;
    icon: string;
    variant: StatusVariant;
}

export const ClientMessagesList = (): JSX.Element => {
    const {companyId, clientId} = useParams<{ companyId: string; clientId: string }>();

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messages", companyId, clientId, page],
        queryFn: async () =>
            SMSMessagesAPI.fetchMessagesForUser(companyId!, clientId!, page, pageSize),
        enabled: !!companyId && !!clientId,
    });

    if (isLoading) return <Loader/>;
    if (isError) return <ErrorBanner error={error} error_translate={"error_fetching_messages"}/>;

    if (!data || data.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-10 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-3 opacity-60"/>
                <p>{t("messages.no_sms_messages_for_client")}</p>
            </div>
        );
    }

    const getStatus = (msg: UserMessageResponse): StatusInfo => {
        if (msg.completed && msg.feedback_content)
            return {label: t("messages.negative_response"), icon: "❌", variant: "destructive"};

        if (msg.feedback_response === "positiveResponse")
            return {label: t("messages.positive_response"), icon: "💚", variant: "secondary"};

        if (msg.clicked_at && !msg.completed)
            return {label: t("messages.clicked_response"), icon: "🔗", variant: "outline"};

        return {label: t("messages.no_response"), icon: "⏳", variant: "outline"};
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-semibold">{t("messages.client_messages")}</p>
                <span className="text-xs text-muted-foreground">
                    {t("common.total")}: {data.total}
                </span>
            </div>

            {data.items.map((msg) => {
                const status = getStatus(msg);


                
                return (
                    <Link to={`sms_message_details/${msg.id}`}>


                        <Card
                            key={msg.id}
                            className="rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <CardContent className="px-3 py-2 flex items-start gap-3">

                                <div className="p-2 rounded-lg bg-secondary/40">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <Badge className=" px-1.5 py-0.5" variant="outline">
                                            {msg.messageType.toUpperCase()}
                                        </Badge>

                                        <span className="text-[10px] text-muted-foreground">
                                        {format(new Date(msg.send_at), "dd MMM yyyy, HH:mm", {locale: pl})}
                                    </span>
                                    </div>

                                    <p className="text-xs leading-tight text-foreground">
                                        {msg.message}
                                    </p>

                                    {msg.feedback_content && (
                                        <p className=" text-muted-foreground italic mt-1">
                                            {t("messages.client_opinion")}: “{msg.feedback_content}”
                                        </p>
                                    )}

                                    <Badge
                                        variant={status.variant}
                                        className="px-2 py-0.5 mt-1"
                                    >
                                        {status.label} {status.icon}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
            
            <div className="flex justify-between pt-3 border-t">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    {t("common.previous")}
                </Button>

                <span className="text-xs text-muted-foreground">
                    {t("common.page")} {page} / {Math.ceil(data.total / pageSize)}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= Math.ceil(data.total / pageSize)}
                    onClick={() => setPage((p) => p + 1)}
                >
                    {t("common.next")}
                </Button>
            </div>
        </div>
    );
};
