import api from "@/api/axios.ts";

interface RegisterRequest {
    email: string;
    password: string;
}

interface RegisterResponse {
    message: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
}

export const authApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const res = await api.post("/auth/register", data);
        return res.data;
    },

    login: async (data: RegisterRequest): Promise<LoginResponse> => {
        const res = await api.post("/auth/login", data);
        return res.data;
    },
};
