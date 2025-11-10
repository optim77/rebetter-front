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
    responded: string | null;
    feedback: string | null;
    invitation_id: string;
}

export const SMSMessagesAPI = {
    createMessage: async (message: CreateMessage, company_id: string, client_id: string) => {
        const res = await api.post(`/messages/${company_id}/${client_id}/send_single_sms`, message);
        return res.data;
    },
    fetchMessagesForUser: async (company_id: string, client_id: string) => {
        const res = await api.get(`/messages/${company_id}/${client_id}`);
        return res.data;
    }
}