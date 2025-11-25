import api from "@/api/axios.ts";

export interface CreateMessage {
    message: string;
    service: string;
    phone: string;
}

export interface GetMessagesForUserResponse {
    id: string;
    message: string;
    send_at: string;
    messageType: string;
    clicked_at: number | null;
    feedback: string | null;
    tracking_id: string;
}

export type UserMessageResponse = {
    "id": string,
    "message": string,
    "send_at": string,
    "messageType": string,
    "clicked_at": string | null;
    "redirect_feedback": string | null,
    "tracking_id": string,
    "is_redirect": boolean | null,
    "is_rating": boolean | null,
    "is_survey": boolean | null,
    "redirect_response": string | null,
    "completed": boolean | null,
    "completed_at": string | null
}
export type PagedUserMessageResponse = {
    page: number | null;
    pages: number | null;
    size: number | null;
    total: number
    items: UserMessageResponse[];
}
export type SMSMessageDetailsResponse = {
    id: string;
    message: string;
    tracking_id: string
    clicked_at: number | null
    messageType: string;
    send_at: number;
    portal: string
    is_redirect: boolean | null;
    redirect_response: string | null;
    redirect_feedback: string | null;
    is_rating: boolean | null;
    rating: number | null;
    rating_feedback: string | null;
    is_survey: boolean | null;
    completed: boolean | null;
    completed_at: number | null;
    service_id: string | null;
    service_name: string | null;
}

export const SMSMessagesAPI = {
    createMessage: async (message: CreateMessage, company_id: string, client_id: string) => {
        const res = await api.post(`/messages/${company_id}/${client_id}/send_single_sms`, message);
        return res.data;
    },
    fetchMessagesForUser: async (company_id: string, client_id: string, page = 1, size = 5) => {
        const res = await api.get<PagedUserMessageResponse>(`/messages/${company_id}/${client_id}?page=${page}&size=${size}`);
        return res.data;
    },
    fetchSMSMessageDetails: async (company_id: string, client_id: string, sms_id: string) => {
        const res = await api.get<SMSMessageDetailsResponse>(`/messages/review/${company_id}/${client_id}/sms_message_details/${sms_id}`);
        return res.data;
    }
}