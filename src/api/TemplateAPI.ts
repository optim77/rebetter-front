import api from "@/api/axios.ts";

export type Template = {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    template: string;
}

export const TemplateAPI = {
    fetchPublicTemplates: async (): Promise<Template[]> => {
        const res = await api.get<Template[]>('/templates/public/list');
        return res.data;
    }
}