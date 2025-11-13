import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/Types.ts";

export interface CreateCompany {
    name: string;
    description?: string;
}

export interface Company {
    id: string;
    name: string;
    description?: string;
    google?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    znany_lekarz?: string;
    booksy_url?: string;
}

export interface Socials {
    google: string | null;
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    linkedin: string | null;
    booksy: string | null;
    znany_lekarz: string | null;
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
    getSocials: async (companyId: string): Promise<Socials> => {
        const res = await api.get<Socials>(`/companies/${companyId}/socials`);
        return res.data;
    },
}