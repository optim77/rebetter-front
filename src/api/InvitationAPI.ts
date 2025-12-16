import api from "@/api/axios.ts";
import type { AxiosResponse } from "axios";

export interface InvitationResponse {
    service_name: string | null;
    service_id: string | null;
    portal: string | null;
    is_feedback: boolean;
    feedback_question: string | null;
    is_survey: boolean;
    survey_id: string | null;
    is_rating: boolean;
    rating_question: string | null;
    is_redirect: boolean;
    company_logo: string | null;
}

export interface InvitationRequest {
    responded: string;
    feedback: string | null;
    rating: number | null;

}

export const InvitationAPI = {
    fetchInvitation: async (company_id: string | undefined, client_id: string | undefined, tracking_id: string | undefined): Promise<InvitationResponse> => {
        const res = await api.get<InvitationResponse>(`/messages/review/${company_id}/${client_id}/${tracking_id}`);
        return res.data;
    },
    pingClicked: async (company_id: string | undefined, client_id: string | undefined, invitation_id: string | undefined): Promise<AxiosResponse> => {
        const res = await api.get(`/messages/review/${company_id}/${client_id}/${invitation_id}/ping`);
        return  res.data;
    },
    sendFeedback: async (company_id: string | undefined, client_id: string | undefined, invitation_id: string | undefined, feedback: string) => {
        const res = await api.post(`/messages/review/${company_id}/${client_id}/${invitation_id}/send_feedback`, {feedback});
        return res.data;
    },
}