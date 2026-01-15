import api from "@/api/axios.ts";

export type TemplateResponse = {
    items: Template[];
    total: number
    page: number,
    size: number,
    pages: number
}

export type Template = {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    template: string;
}

export const TemplateAPI = {
    fetchPublicTemplates: async (): Promise<TemplateResponse> => {
        const res = await api.get<TemplateResponse>('/templates/public/list');
        return res.data;
    }
}