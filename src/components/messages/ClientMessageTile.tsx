import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Check, CheckCircle2, Clock, FileText, Link2, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { t } from "i18next";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Link } from "react-router-dom";
import type { UserMessageResponse } from "@/api/MessagesAPI.ts";

interface Props {
    msg: UserMessageResponse
}

export const ClientMessageTile = ({msg}: Props):JSX.Element => {

    const getStatusInfo = (msg: UserMessageResponse) => {
        if (msg.completed) {
            return {
                label: t("messages.received_feedback"),
                icon: <Check className="h-4 w-4" />,
                color: "bg-green-50 text-green-700",
            };
        }

        if (msg.clicked_at && !msg.completed) {
            return {
                label: t("messages.link_clicked"),
                icon: <Link2 className="h-4 w-4" />,
                color: "bg-blue-50 text-blue-700",
            };
        }

        return {
            label: t("messages.awaiting_response"),
            icon: <Clock className="h-4 w-4" />,
            color: "bg-gray-100 text-gray-700",
        };
    };

    const status = getStatusInfo(msg);

    return (
        <Link
            key={msg.id}
            to={`sms_message_details/${msg.id}`}
            className="block transition-colors hover:bg-muted/40 rounded-lg"
        >
            <Card className="border">
                <CardContent className="p-5">
                    <div className="flex gap-4">
                        <div className="mt-1 rounded-lg bg-muted p-2.5">
                            {msg.is_survey ? (
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            ) : msg.is_rating ? (
                                <Star className="h-5 w-5 text-amber-600" />
                            ) : (
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="text-xs font-normal">
                                    {msg.messageType.toUpperCase()}
                                </Badge>

                                {msg.is_survey ? (
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {t("common.survey")}
                                    </Badge>
                                ) : msg.is_rating ? (
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {t("common.rating")}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {t("common.simple_feedback")}
                                    </Badge>
                                )}

                                <span className="ml-auto text-xs text-muted-foreground">
                          {format(new Date(msg.send_at), "dd MMM yyyy, HH:mm", { locale: pl })}
                        </span>
                            </div>

                            <p className="text-sm leading-relaxed line-clamp-3">
                                {msg.message}
                            </p>

                            {msg.feedback_content && (
                                <div className="mt-2 rounded border bg-muted/40 p-3 text-sm">
                                    <span className="font-medium text-muted-foreground">
                                        {t("messages.client_opinion")}:
                                    </span>{" "}
                                    <span className="italic">„{msg.feedback_content}”</span>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <div
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                                >
                                    {status.icon}
                                    {status.label}
                                </div>

                                {msg.completed_at && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                        {format(new Date(msg.completed_at), "dd MMM, HH:mm", { locale: pl })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}