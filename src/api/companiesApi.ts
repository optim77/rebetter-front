import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/type.ts";
import type { AxiosResponse } from "axios";

export interface CreateCompany {
    name: string;
    description?: string;
}

export interface Company {
    id: string;
    name: string;
    description?: string;
    google_review_link?: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    tiktok_url?: string;
    znany_lekarz?: string;
    booksy_url?: string;

}

export const companiesApi = {
    getCompanies: async (params: PaginationParams) => {
        const res = await api.get("/companies/", { params });
        return res.data;
    },
    getCompany: async (companyId: string): Promise<Company> => {
        const res = await api.get<Company>(`/companies/${companyId}`);
        return res.data;
    },
    createCompany: async (data: CreateCompany) => {
        const res = await api.post<Company>("/companies/", data);
        return res.data;
    },
    getSocials: async (companyId: string): Promise<AxiosResponse> => {
        return await api.get<AxiosResponse>(`/companies/${companyId}/socials`);
    },
}