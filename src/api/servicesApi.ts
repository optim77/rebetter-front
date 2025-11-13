import type { PaginationParams } from "@/api/Types.ts";
import api from "@/api/axios.ts";

export interface Service {
    id: string;
    name: string;
    description: string;
}

export interface Services {
    items: Service[];
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
        self: string
    }
    page: number
    pages: number
    size: number
    total: number
}

export const servicesApi = {
    getService: async (companyId: string, serviceId: string): Promise<Service> => {
        const res = await api.get<Service>(`/services/${companyId}/${serviceId}`);
        return res.data;
    },
    getServices: async (companyId: string, params?: PaginationParams): Promise<Services> => {
        const res = await api.get(`/services/${companyId}`, {params});
        return res.data;
    },
    createService: async (service: Service, companyId: string | undefined) => {
        if (!companyId) throw new Error();
        const res = await api.post<Service>(`/services/${companyId}`, service);
        return res.data;
    },
    updateServices: async (companyId: string, serviceId: string) => {

    },
    deleteServices: async (companyId: string, serviceId: string) => {

    }
}