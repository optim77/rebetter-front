import { type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SMSMessagesAPI } from "@/api/SMSMessagesAPI.ts";
import { t } from "i18next";

export const SMSMessageDetails = (): JSX.Element => {
    const { companyId, clientId, smsId } = useParams<{
        companyId: string;
        clientId: string;
        smsId: string;
    }>();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["SMSMessage", companyId, clientId, smsId],
        queryFn: async () =>
            SMSMessagesAPI.fetchSMSMessageDetails(companyId!, clientId!, smsId!),
        enabled: !!companyId && !!clientId && !!smsId,
    });

    if (isLoading) {
        return <div className="p-4">{t("common.loading")}</div>;
    }

    if (isError) {
        return (
            <div className="p-4 text-red-600">
                {error instanceof Error ? error.message : t("common.unexpected_error")}
            </div>
        );
    }

    if (!data) {
        return <div className="p-4">{t("common.no_message_data")}</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t("sms.sms_message_details")}</h1>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <Item label={t("common.message_id")} value={data.id} />
                <Item label={t("common.message_content")} value={data.message} />
                <Item label={t("common.message_type")} value={data.messageType} />
                <Item label={t("common.send_date")} value={new Date(data.send_at).toLocaleString()} />
                <Item label={t("common.portal")} value={data.portal ?? t("common.none")} />
                <Item label={t("common.tracking_id")} value={data.tracking_id ?? t("common.none")} />
                <Item
                    label={t("common.clicked_at")}
                    value={
                        data.clicked_at
                            ? new Date(data.clicked_at).toLocaleString()
                            : t("common.not_clicked")
                    }
                />
                <Item label={t("common.completed")} value={data.completed ? t("common.yes") : t("common.no")} />
                <Item
                    label={t("common.completed_at")}
                    value={
                        data.completed_at
                            ? new Date(data.completed_at).toLocaleString()
                            : t("common.none")
                    }
                />

                <Section title={t("common.redirect")}>
                    <Item label={t("common.is_redirect")} value={data.is_feedback ? t("common.yes") : t("common.no")} />
                    <Item label={t("common.feedback_response")} value={data.feedback_response || t("common.none")} />
                    <Item label={t("common.feedback_content")} value={data.feedback_content || t("common.none")} />
                </Section>

                <Section title={t("common.rating")}>
                    <Item label={t("common.is_rating")} value={data.is_rating ? t("common.yes") : t("common.no")} />
                    <Item label={t("common.rating_value")} value={data.rating ?? t("common.none")} />
                    <Item label={t("common.rating_feedback")} value={data.rating_feedback || t("common.none")} />
                </Section>

                <Section title={t("common.survey")}>
                    <Item label={t("common.is_survey")} value={data.is_survey ? t("common.yes") : t("common.no")} />

                </Section>


                    {data.service_name && data.service_name ? (
                        <>
                        <Section title={t("common.service")}>
                            <Link to={`/dashboard/company/${companyId}/services/${data.service_id}`}>{data.service_name}</Link>
                            <Item label={t("common.service_id")} value={data.service_id || t("common.none")} />
                            <Item label={t("common.service_name")} value={data.service_name || t("common.none")} />
                        </Section>
                        </>
                    ) : (<></>)}


            </div>
        </div>
    );
};

const Item = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between border-b pb-2 text-sm">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="text-gray-900">{value}</span>
    </div>
);

const Section = ({ title, children }: { title: string; children: JSX.Element | JSX.Element[] }) => (
    <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="space-y-2">{children}</div>
    </div>
);
