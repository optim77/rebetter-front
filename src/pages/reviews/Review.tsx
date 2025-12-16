import { type JSX, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InvitationAPI, type InvitationResponse } from "@/api/InvitationAPI.ts";
import { Loader } from "@/components/elements/Loader.tsx";
import { ErrorBanner } from "@/components/elements/ErrorBanner.tsx";

import { FeedbackFlow } from "@/components/review/FeedbackFlow.tsx";
import { toast } from "react-hot-toast";
import { t } from "i18next";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import { FeedbackAlreadyDone } from "@/components/review/FeedbackAlreadyDone.tsx";
import type { AxiosError } from "axios";
import { RatingFlow } from "@/components/review/RatingFlow.tsx";


export const Review = (): JSX.Element => {

    const {companyId, clientId, trackingId} = useParams<{ companyId: string, clientId: string, trackingId: string }>();

    const {data: invitation, isLoading, isError, error} = useQuery<InvitationResponse, AxiosError<ApiError>>({
        queryKey: ["invitation", companyId, clientId, trackingId],
        retry: false,
        queryFn: async () => {
            if (!companyId || !clientId || !trackingId) throw new Error("Missing companyId");
            return InvitationAPI.fetchInvitation(companyId, clientId, trackingId);
        },
        enabled: !!companyId && !!clientId && !!trackingId,
    });
    const ping = useMutation({
        mutationFn: async () => {
            if (!companyId || !clientId || !trackingId) throw new Error("Missing company or client ID!");
            return InvitationAPI.pingClicked(companyId, clientId, trackingId).catch((error: Error) => {
                console.error(error);
            });
        },
        onSuccess: () => {
        },
        onError: (error) => {
            console.error(error)
            const apiError: ApiError = handleApiError(error);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Failed to send ping:", apiError);
        },
    });


    useEffect(() => {
        ping.mutate();
    }, [companyId, clientId, trackingId]);

    if (isLoading) {
        return <Loader/>
    }

    if (isError && error.status === 409) {
        return (
            <FeedbackAlreadyDone />
        );
    }
    if (isError) {
        return <ErrorBanner error={error} error_translate={'error_fetching_invitation'}/>
    }
    return (
        <>
            {invitation?.is_feedback && !invitation.is_redirect && (
                <FeedbackFlow
                    service_name={invitation.service_name}
                    portal={invitation.portal}
                    feedback_question={invitation.feedback_question}
                    clientId={clientId}
                    companyId={companyId}
                    trackingId={trackingId}
                    is_redirect={invitation.is_redirect}
                />
            )}

            {invitation && invitation.is_rating && (
                <RatingFlow
                    portal={invitation.portal}
                    service_name={invitation.service_name}
                    rating_question={invitation.rating_question}
                    is_redirect={invitation.is_redirect}
                    companyId={companyId}
                    clientId={clientId}
                    trackingId={trackingId}
                />
            )}

        </>
    )
}