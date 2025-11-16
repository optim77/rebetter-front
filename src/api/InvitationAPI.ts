import api from "@/api/axios.ts";
import type { AxiosResponse } from "axios";

export interface InvitationResponse {
    portal: string;
    service: string;
    company_logo: string;
    company_name: string;
    is_rating: boolean | null;
    is_redirect: boolean | null;
    is_survey: boolean | null;
}

export interface InvitationRequest {
    responded: string;
    feedback: string | null;
    rating: number | null;

}

export const InvitationAPI = {
    fetchInvitation: async (company_id: string | undefined, client_id: string | undefined, tracking_id: string | undefined): Promise<InvitationResponse> => {
        const res = await api.get(`/messages/review/${company_id}/${client_id}/${tracking_id}`);
        return res.data;
    },
    pingClicked: async (company_id: string | undefined, client_id: string | undefined, invitation_id: string | undefined): Promise<AxiosResponse> => {
        const res = await api.get(`/messages/review/${company_id}/${client_id}/${invitation_id}/ping`);
        return  res.data;
    },
    sendRedirectPositiveResponse: async (company_id: string | undefined, client_id: string | undefined, invitation_id: string | undefined) => {
        const res = await api.post(`/messages/review/${company_id}/${client_id}/${invitation_id}/url_feedback_positive`);
        return res.data;
    },
    sendRedirectNegativeResponse: async (company_id: string | undefined, client_id: string | undefined, invitation_id: string | undefined, feedback: string | null) => {
        const res = await api.post(`/messages/review/${company_id}/${client_id}/${invitation_id}/url_feedback_negative`, {
            feedback: feedback,
        });
        return res.data;
    }
}