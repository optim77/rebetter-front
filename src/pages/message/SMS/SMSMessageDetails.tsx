import { type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessagesAPI } from "@/api/MessagesAPI.ts";
import { t } from "i18next";
import {
    MessageSquare,
    CheckCircle2,
    Clock,
    Link2,
    FileText,
    Star,
    Calendar,
    Send,
    Globe,
    Hash,
    UserCheck, ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";
import { NoFoundMessage } from "@/components/messages/elements/NoFoundMessage.tsx";
import { formatDate } from "@/utils/FormatData.ts";
import { MessageDetail } from "@/components/messages/MessageDetail.tsx";

export const SMSMessageDetails = (): JSX.Element => {
    const { groupId, clientId, smsId } = useParams<{
        groupId: string;
        clientId: string;
        smsId: string;
    }>();

    const {
        data: msg,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["SMSMessage", groupId, clientId, smsId],
        queryFn: async () => MessagesAPI.fetchSMSMessageDetails(groupId!, clientId!, smsId!),
        enabled: !!groupId && !!clientId && !!smsId,
    });

    if (isLoading) return <BaseSpinner />;

    if (isError || !msg) return <NoFoundMessage groupId={groupId} clientId={clientId} />


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">

            <div className="mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/group/${groupId}/client/${clientId}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
                            <MessageSquare className="h-6 w-6" />
                            {t("sms.sms_message_details")}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t("messages.message_id")} {": "} <span className="font-mono">{msg.id}</span>
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                        <Send className="h-5 w-5" />
                        {t("common.basic_info")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <MessageDetail label={t("common.message_content")} value={msg.message} />

                    <div className="flex flex-wrap gap-4">
                        <Badge variant="outline">{msg.messageType.toUpperCase()}</Badge>
                        {msg.is_survey && <Badge variant="outline">{t("common.survey")}</Badge>}
                        {msg.is_rating && <Badge variant="outline">{t("common.rating")}</Badge>}
                        {msg.is_feedback && <Badge variant="outline">{t("common.simple_feedback")}</Badge>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <MessageDetail
                            label={t("common.send_date")}
                            value={formatDate(msg.send_at)}
                            icon={<Calendar className="h-4 w-4" />}
                        />
                        <MessageDetail
                            label={t("common.tracking_id")}
                            value={msg.tracking_id || t("common.none")}
                            icon={<Hash className="h-4 w-4" />}
                        />
                        <MessageDetail
                            label={t("common.redirect")}
                            value={msg.is_redirect ? t("common.yes") : t("common.no")}
                            icon={<Globe className="h-4 w-4" />}
                        />
                        {msg.portal && (
                            <MessageDetail
                                label={t("common.redirect_portal")}
                                value={msg.portal}
                                icon={<Globe className="h-4 w-4" />}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5" />
                        {t("common.client_response")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <MessageDetail
                            label={t("common.clicked_at")}
                            value={msg.clicked_at ? formatDate(msg.clicked_at) : t("common.not_clicked")}
                            icon={
                                msg.clicked_at ? (
                                    <Link2 className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                )
                            }
                        />

                        <MessageDetail
                            label={t("common.completed")}
                            value={msg.completed ? t("common.yes") : t("common.no")}
                            icon={
                                msg.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Clock className="h-4 w-4 text-orange-600" />
                                )
                            }
                        />

                        {msg.completed_at && (
                            <MessageDetail
                                label={t("common.completed_at")}
                                value={formatDate(msg.completed_at)}
                                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {(msg.feedback_content || msg.rating || (msg.survey && msg.survey_answer)) && (
                <Card className="mt-6">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3">
                            <FileText className="h-5 w-5" />
                            {msg.is_survey
                                ? msg.survey?.name || t("common.survey_response")
                                : msg.is_rating
                                    ? t("common.rating")
                                    : t("common.feedback")}
                        </CardTitle>
                        {msg.is_survey && msg.survey?.description && (
                            <p className="text-sm text-muted-foreground mt-1">{msg.survey.description}</p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {msg.is_feedback && msg.feedback_content && (
                            <div className="rounded border bg-muted/40 p-5">
                                <p className="font-medium mb-2">{t("messages.client_opinion")}:</p>
                                <p className="whitespace-pre-wrap">„{msg.feedback_content}”</p>
                            </div>
                        )}

                        {msg.is_rating && msg.rating && (
                            <div className="space-y-3">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-7 w-7 ${
                                                star <= (msg.rating || 0)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-muted"
                                            }`}
                                        />
                                    ))}
                                </div>
                                {msg.rating_feedback && (
                                    <p className="text-sm text-muted-foreground italic">
                                        {msg.rating_feedback}
                                    </p>
                                )}
                            </div>
                        )}

                        {msg.is_survey && msg.survey && msg.survey_answer && (
                            <div className="space-y-5">
                                {msg.survey.content.map((question) => {
                                    const answer = msg.survey_answer?.[question.id];

                                    return (
                                        <div key={question.id} className="space-y-2">
                                            <p className="font-medium flex items-center gap-2">
                                                {question.required && <span className="text-destructive">*</span>}
                                                {question.label}
                                            </p>

                                            {question.type === "text" && (
                                                <p className="text-sm bg-muted/40 p-4 rounded border">
                                                    {answer || <span className="italic text-muted-foreground">{t("common.no_answer")}</span>}
                                                </p>
                                            )}

                                            {question.type === "choice" && question.options && (
                                                <Badge variant="outline" className="text-sm py-1.5 px-3">
                                                    {answer || <span className="italic text-muted-foreground">{t("common.no_answer")}</span>}
                                                </Badge>
                                            )}

                                            {question.type === "rating" && (
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-6 w-6 ${
                                                                star <= (Number(answer) || 0)
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-muted"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/*{msg.service_name && msg.service_id && (*/}
            {/*    <Card className="mt-6">*/}
            {/*        <CardHeader className="pb-4">*/}
            {/*            <CardTitle className="flex items-center gap-3">*/}
            {/*                <Globe className="h-5 w-5" />*/}
            {/*                {t("common.service")}*/}
            {/*            </CardTitle>*/}
            {/*        </CardHeader>*/}
            {/*        <CardContent>*/}
            {/*            <Link*/}
            {/*                to={`/dashboard/group/${groupId}/services/${msg.service_id}`}*/}
            {/*                className="text-primary hover:underline font-medium"*/}
            {/*            >*/}
            {/*                {msg.service_name}*/}
            {/*            </Link>*/}
            {/*            <p className="text-sm text-muted-foreground mt-1">*/}
            {/*                ID: {msg.service_id}*/}
            {/*            </p>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}
            {/*)}*/}
        </div>
    );
};

