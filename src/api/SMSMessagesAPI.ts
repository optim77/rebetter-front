import api from "@/api/axios.ts";

export interface Message {
    message: string;
    service: string;
    phone: string;
}

export const SMSMessagesAPI = {
    createMessage: async (message: Message, company_id: string, client_id: string) => {
        const res = await api.post(`/messages/${company_id}/${client_id}`, message);
        return res.data;
    }
}