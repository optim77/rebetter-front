import type { PaginationParams } from "@/api/type.ts";
import api from "@/api/axios.ts";
import type { AxiosResponse } from "axios";

export interface Services {
    id?: string;
    name: string;
    description: string;
}

export const servicesApi = {
    getService: async (companyId: string, serviceId: string): Promise<Services> => {
        const res = await api.get<Services>(`/services/${companyId}/${serviceId}`);
        return res.data;
    },
    getServices: async (companyId: string, params: PaginationParams): Promise<AxiosResponse> => {
        return await api.get(`/services/${companyId}`, {params});
    },
    createService: async (service: Services, companyId: string | undefined) => {
        if (!companyId) throw new Error();
        const res = await api.post<Services>(`/services/${companyId}`, service);
        return res.data;
    },
    updateServices: async (companyId: string, serviceId: string) => {

    },
    deleteServices: async (companyId: string, serviceId: string) => {

    }
}