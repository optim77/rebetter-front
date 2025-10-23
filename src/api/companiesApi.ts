import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/type.ts";

export interface CreateCompany {
    name: string;
    description?: string;
}

export interface Company {
    id: string;
    name: string;
    description?: string;
}

export const companiesApi = {
    getCompanies: async (params: PaginationParams) => {
        const res = await api.get("/companies/", { params });
        return res.data;
    },
    createCompany: async (data: CreateCompany) => {
        const res = await api.post<Company>("/companies/", data);
        return res.data;
    }
}