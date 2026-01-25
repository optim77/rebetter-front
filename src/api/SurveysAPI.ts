import api from "@/api/axios.ts";
import type { PaginationParams } from "@/api/Types.ts";

export type Surveys = {
    items: Survey[];
    page: number;
    pages: number;
    size: number;
    total: number;
}
export type Survey = {
    id: string;
    name: string;
    description: string;
    content: any;
    created_at: number
    updated_at: number
}
export type CreateSurveyResponse = {
    id: string;
}

export const SurveysAPI = {
    fetchSurveys: async (companyId: string, params: PaginationParams) => {
        const res = await api.get<Surveys>(`/surveys/${companyId}/list`, {params});
        return res.data;
    },

    createSurvey: async (companyId: string | undefined, payload: any) => {
        const res = await api.post<CreateSurveyResponse>(`/surveys/${companyId}/create`, payload);
        return res.data;
    },

    getSurvey: async (companyId: string, surveyId: string) => {
        const res = await api.get(`/surveys/${companyId}/${surveyId}`);
        return res.data;
    },

    updateSurvey: async (companyId: string, surveyId: string, payload: any) => {
        const res = await api.put(`/surveys/${companyId}/${surveyId}`, payload);
        return res.data;
    },

    deleteSurvey: async (companyId: string, surveyId: string) => {
        const res = await api.delete(`/surveys/${companyId}/${surveyId}`);
        return res.data;
    },
    getSurveyAnalytic: async (companyId: string, surveyId: string) => {
        const res = await api.get(`/surveys/${companyId}/${surveyId}/analytic`);
        return res.data;
    }
};
