import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/Types.ts";

export interface CreateCompany {
    name: string;
    description?: string;
}

export interface Group {
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

export const GroupsApi = {
    getGroups: async (params: PaginationParams) => {
        const res = await api.get("/groups/", { params });
        return res.data;
    },
    getGroup: async (companyId: string): Promise<Group> => {
        const res = await api.get<Group>(`/groups/${companyId}`);
        return res.data;
    },
    createGroup: async (data: CreateCompany) => {
        const res = await api.post<Group>("/groups/", data);
        return res.data;
    },
    getSocials: async (companyId: string): Promise<Socials> => {
        const res = await api.get<Socials>(`/groups/${companyId}/socials`);
        return res.data;
    },
}