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

export const SMSMessagesAPI = {
    createMessage: async (message: CreateMessage, company_id: string, client_id: string) => {
        const res = await api.post(`/messages/${company_id}/${client_id}/send_single_sms`, message);
        return res.data;
    },
    fetchMessagesForUser: async (company_id: string, client_id: string) => {
        const res = await api.get<PagedUserMessageResponse>(`/messages/${company_id}/${client_id}`);
        return res.data;
    }
}