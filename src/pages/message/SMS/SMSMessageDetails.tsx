import { type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessagesAPI } from "@/api/MessagesAPI.ts";
import { t } from "i18next";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { motion } from "framer-motion";
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
    UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const SMSMessageDetails = (): JSX.Element => {
    const {companyId, clientId, smsId} = useParams<{
        companyId: string;
        clientId: string;
        smsId: string;
    }>();

    const {
        data: msg,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["SMSMessage", companyId, clientId, smsId],
        queryFn: async () => MessagesAPI.fetchSMSMessageDetails(companyId!, clientId!, smsId!),
        enabled: !!companyId && !!clientId && !!smsId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">{t("common.loading")}...</div>
            </div>
        );
    }

    if (isError || !msg) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center text-red-600 bg-red-50 py-4 px-8 rounded-2xl">
                    {error instanceof Error ? error.message : t("common.unexpected_error")}
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string | null) =>
        dateStr ? format(new Date(dateStr), "dd MMM yyyy, HH:mm", {locale: pl}) : t("common.none");

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.7}}
                className="max-w-5xl mx-auto"
            >
                <Card
                    className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <MessageSquare className="w-10 h-10"/>
                            {t("sms.sms_message_details")}
                        </h1>
                        <p className="mt-2 text-indigo-100">
                            ID: <span className="font-mono text-sm">{msg.id}</span>
                        </p>
                    </div>

                    <CardContent className="p-8 space-y-10">
                        <Section title={t("common.basic_info")} icon={<Send className="w-5 h-5"/>}>
                            <Detail label={t("common.message_content")} value={msg.message}/>
                            <Detail label={t("common.message_type")}
                                    value={<Badge variant="secondary">{msg.messageType.toUpperCase()}</Badge>}/>
                            <Detail label={t("common.send_date")} value={formatDate(msg.send_at)} icon={<Calendar/>}/>
                            <Detail label={t("common.tracking_id")} value={msg.tracking_id || t("common.none")}
                                    icon={<Hash/>}/>
                            <Detail label={t("common.redirect")} value={msg.is_redirect === true ? t("common.yes") : t("common.no") || t("common.none")} icon={<Globe />} />
                            <Detail label={t("common.redirect_portal")} value={msg.portal || t("common.none")} icon={<Globe />}/>


                        </Section>

                        <Section title={t("common.client_response")} icon={<UserCheck className="w-5 h-5"/>}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Detail
                                    label={t("common.clicked_at")}
                                    value={msg.clicked_at ? formatDate(msg.clicked_at) : t("common.not_clicked")}
                                    icon={msg.clicked_at ? <Link2 className="w-5 h-5 text-blue-600"/> :
                                        <Clock className="w-5 h-5 text-gray-500"/>}
                                />
                                <Detail
                                    label={t("common.completed")}
                                    value={msg.completed ? t("common.yes") : t("common.no")}
                                    icon={msg.completed ? <CheckCircle2 className="w-5 h-5 text-green-600"/> :
                                        <Clock className="w-5 h-5 text-orange-600"/>}
                                />
                                {msg.completed_at && (
                                    <Detail
                                        label={t("common.completed_at")}
                                        value={formatDate(msg.completed_at)}
                                        icon={<CheckCircle2 className="w-5 h-5 text-green-600"/>}
                                    />
                                )}
                            </div>
                        </Section>

                        {msg.is_feedback && msg.feedback_content && msg.completed && (
                            <Section title={msg.message} icon={<FileText className="w-5 h-5"/>} subtitle={t("messages.client_answer")}>
                                <div className="space-y-6">


                                    <motion.div
                                        key={msg.feedback_content}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-md"
                                    >
                                        <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            {msg.feedback_content}
                                        </p>
                                    </motion.div>

                                </div>
                            </Section>
                        )}

                        {msg.is_rating && msg.rating && msg.completed && (
                            <Section title={msg.message} icon={<FileText className="w-5 h-5"/>} subtitle={t("messages.client_rating")}>
                                <div className="space-y-6">


                                    <motion.div
                                        key={msg.rating}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-md"
                                    >
                                        <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-8 h-8 ${star <= (msg.rating || 0)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </p>

                                        {msg.rating_feedback && (
                                            <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                {msg.rating_feedback}
                                            </p>
                                        )}

                                    </motion.div>

                                </div>
                            </Section>
                        )}


                        {msg.is_survey && msg.survey && msg.completed && (
                            <Section title={msg.survey.name} icon={<FileText className="w-5 h-5"/>}
                                     subtitle={msg.survey.description}>
                                <div className="space-y-6">
                                    {msg.survey.content.map((question) => {
                                        const answer = msg.survey_answer?.[question.id];

                                        return (
                                            <motion.div
                                                key={question.id}
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-md"
                                            >
                                                <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                    {question.required && <span className="text-red-500">*</span>}
                                                    {question.label}
                                                </p>

                                                {question.type === "text" && (
                                                    <p className="text-gray-700 bg-white rounded-xl p-4 border">
                                                        {answer || <span
                                                          className="italic text-gray-400">{t("common.no_answer")}</span>}
                                                    </p>
                                                )}

                                                {question.type === "choice" && question.options && (
                                                    <Badge variant="outline" className="text-base py-2 px-4">
                                                        {answer || <span
                                                          className="italic text-gray-400">{t("common.no_answer")}</span>}
                                                    </Badge>
                                                )}

                                                {question.type === "rating" && (
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-8 h-8 ${star <= (answer || 0)
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </Section>
                        )}

                        {msg.service_name && msg.service_id && (
                            <Section title={t("common.service")} icon={<Globe className="w-5 h-5"/>}>
                                <Link
                                    to={`/dashboard/company/${companyId}/services/${msg.service_id}`}
                                    className="text-indigo-600 font-semibold hover:underline text-lg"
                                >
                                    {msg.service_name}
                                </Link>
                                <Detail label={t("common.service_id")} value={msg.service_id}/>
                            </Section>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

const Section = ({title, subtitle, icon, children}: {
    title: string;
    subtitle?: string | null;
    icon: JSX.Element;
    children: JSX.Element | JSX.Element[];
}) => (
    <div className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {icon}
            {title}
        </h2>
        {subtitle && <p className="text-gray-600 italic ml-8">{subtitle}</p>}
        <div className="border-l-4 border-indigo-400 pl-6">{children}</div>
    </div>
);

const Detail = ({label, value, icon}: { label: string; value: JSX.Element | string; icon?: JSX.Element }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <span className="text-gray-600 font-medium flex items-center gap-2">
            {icon}
            {label}
        </span>
        <span className="text-gray-900 font-medium text-right max-w-md break-words">
            {value}
        </span>
    </div>
);