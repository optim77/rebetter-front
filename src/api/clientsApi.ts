import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/Types.ts";
import type { AxiosResponse } from "axios";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
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
    note: string;
}

export const clientsApi = {
    getClient: async (companyId: string, clientId: string): Promise<Client> => {
        const res = await api.get<Client>(`/clients/${companyId}/${clientId}`);
        return res.data;
    },
    getClients: async (companyId: string, params: PaginationParams): Promise<AxiosResponse> => {
        return await api.get<ClientResponse>(`/clients/${companyId}`, {params});
    },
    createClient: async (data: CreateClient, companyId: string | undefined) => {
        if (!companyId) throw new Error();
        const res = await api.post<Client>(`/clients/${companyId}`, data);
        return res.data;
    },
    updateClient: async (companyId: string, clientId: string, client: CreateClient): Promise<Client> => {
        const res = await api.put<Client>(`/clients/${companyId}/${clientId}`, client);
        return res.data;
    },
    deleteClient: async (companyId: string, clientId: string): Promise<AxiosResponse> => {
        return await api.delete<Client>(`/clients/${companyId}/${clientId}`);
    }
}