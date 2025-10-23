import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/type.ts";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    note: string;
    company_id: string;
}

export interface ClientResponse {
    items: Client[];
    page: number;
    pages: number;
    size: number;
    total: number;
}

export interface CreateClient{
    name: string;
    email: string;
    phone: string;
    service: string;
    note: string;
    company: string;
}

export const clientsApi = {
    getClients: async (companyId: string, params: PaginationParams) => {
        return await api.get<ClientResponse>(`/clients/${companyId}`, {params});
    },
    createClient: async (data: CreateClient) => {
        const res = await api.post<Client>("/clients/", data);
        return res.data;
    }
}