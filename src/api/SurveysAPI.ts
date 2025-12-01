import api from "@/api/axios.ts";

export const SurveysAPI = {
    fetchSurveys: async (companyId: string, page: number, pageSize: number) => {
        const res = await api.get(`/surveys/${companyId}/list`, {
            params: {
                page,
                page_size: pageSize,
            },
        });
        return res.data;
    },

    createSurvey: async (companyId: string, payload: any) => {
        const res = await api.post(`/surveys/${companyId}/create`, payload);
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
};
