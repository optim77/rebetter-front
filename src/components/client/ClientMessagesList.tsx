import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { SMSMessagesAPI } from "@/api/SMSMessagesAPI";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";

interface Message {
    id: string;
    message: string;
    send_at: string;
    messageType: string;
    responded?: string | null;
    feedback?: string | null;
    invitation_id?: string | null;
}

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
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">{t("action.loading")}</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center text-destructive py-8">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{t("errors.error_fetching_messages")}: {(error as Error).message}</span>
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-10 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-3 opacity-60" />
                <p>{t("messages.no_sms_messages_for_user")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.items.map((msg) => (
                <Card key={msg.id} className="shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Badge variant="outline">{msg.messageType}</Badge>
                            <span className="text-xs text-muted-foreground">
                {format(new Date(msg.send_at), "dd MMM yyyy, HH:mm", { locale: pl })}
              </span>
                        </div>

                        <p className="text-sm text-foreground">{msg.message}</p>

                        {msg.feedback && (
                            <p className="text-xs text-muted-foreground italic">
                                {t("messages.client_opinion")}: “{msg.feedback}”
                            </p>
                        )}
                        <Badge variant="secondary" className="w-fit">
                        {msg.responded ? (

                                "Odpowiedziano"

                        ) : "Brak odpowiedzi"}
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
