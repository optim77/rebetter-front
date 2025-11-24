import { type JSX } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SMSMessagesAPI } from "@/api/SMSMessagesAPI.ts";

export const SMSMessageDetails = ():JSX.Element => {
    const {companyId, clientId, smsId} = useParams<{ companyId: string; clientId: string, smsId: string }>();

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


    return (
        <>

        </>
    )
}