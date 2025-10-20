import api from "./axios";

export const getCompanies = async (params?: { skip?: number; limit?: number; search_term?: string }) => {
    const res = await api.get("/companies", { params });
    return res.data;
};

export const createCompany = async (data: { name: string; description?: string }) => {
    const res = await api.post("/companies", data);
    return res.data;
};
