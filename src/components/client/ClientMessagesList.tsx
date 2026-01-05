import { type JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { MessagesAPI, type UserMessageResponse } from "@/api/MessagesAPI.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";
import { motion } from "framer-motion";
import {
    MessageSquare,
    CheckCircle2,
    Star,
    FileText,
    Clock,
    Link2,
    Check
} from "lucide-react";

export const ClientMessagesList = (): JSX.Element => {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messages", companyId, clientId, page],
        queryFn: async () => MessagesAPI.fetchMessagesForUser(companyId!, clientId!, page, pageSize),
        enabled: !!companyId && !!clientId,
    });

    const getStatusInfo = (msg: UserMessageResponse) => {

        if (msg.completed) {
            return {
                label: t("messages.received_feedback"),
                icon: <Check className="w-4 h-4" />,
                variant: "secondary" as const,
                color: "text-green-600 bg-green-50"
            };
        }

        if (msg.clicked_at && !msg.completed) {
            return {
                label: t("messages.link_clicked"),
                icon: <Link2 className="w-4 h-4" />,
                variant: "outline" as const,
                color: "text-blue-600 bg-blue-50"
            };
        }

        return {
            label: t("messages.awaiting_response"),
            icon: <Clock className="w-4 h-4" />,
            variant: "outline" as const,
            color: "text-gray-600 bg-gray-50"
        };
    };

    if (isLoading) return <Loader />;
    if (isError) return <ErrorBanner error={error} error_translate="error_fetching_messages" />;

    if (!data || data.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-6" />
                <p className="text-lg text-muted-foreground">{t("messages.no_sms_messages_for_client")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >

                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-8 border border-white/60">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {t("messages.client_messages")}
                        </h2>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            {t("common.total")}: {data.total}
                        </Badge>
                    </div>
                </div>


                <div className="space-y-4">
                    {data.items.map((msg, index) => {
                        const status = getStatusInfo(msg);

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`sms_message_details/${msg.id}`}>
                                    <Card className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex gap-5 items-start">
                                                <div className="p-1 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                                                    {msg.is_survey ? <FileText className="w-6 h-6 text-indigo-600" />
                                                        : msg.is_rating ? <Star className="w-6 h-6 text-yellow-500" />
                                                            : <MessageSquare className="w-6 h-6 text-gray-600" />}


                                                </div>

                                                <div className="flex-1 ">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Badge variant="outline" className="font-medium mr-2">
                                                                {msg.messageType.toUpperCase()}
                                                            </Badge>
                                                            <Badge variant="outline" className="font-medium">
                                                                {msg.is_survey ? (<p>{t("common.survey")}</p>)
                                                                    : msg.is_rating ? (<p>{t("common.rating")}</p>)
                                                                        : (<p>{t("common.simple_feedback")}</p>)}
                                                            </Badge>
                                                        </div>



                                                        <span className="text-sm text-gray-500">
                                                            {format(new Date(msg.send_at), "dd MMM yyyy, HH:mm", { locale: pl })}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-800 leading-relaxed">
                                                        {msg.message}
                                                    </p>


                                                    {msg.feedback_content && (
                                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                            <p className="text-sm italic text-gray-700">
                                                                <span className="font-medium">{t("messages.client_opinion")}:</span>
                                                                <br />
                                                                “{msg.feedback_content}”
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3 mt-4">
                                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.color}`}>
                                                            {status.icon}
                                                            <span className="text-sm font-medium">{status.label}</span>
                                                        </div>

                                                        {msg.completed_at && (
                                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                {format(new Date(msg.completed_at), "dd MMM, HH:mm", { locale: pl })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {data.total > pageSize && (
                    <div className="mt-10 flex justify-center items-center gap-6">
                        <Button
                            variant="outline"
                            size="lg"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-xl"
                        >
                            {t("common.previous")}
                        </Button>

                        <span className="text-gray-600 font-medium">
                            {t("common.page")} {page} / {Math.ceil(data.total / pageSize)}
                        </span>

                        <Button
                            variant="outline"
                            size="lg"
                            disabled={page >= Math.ceil(data.total / pageSize)}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-xl"
                        >
                            {t("common.next")}
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};