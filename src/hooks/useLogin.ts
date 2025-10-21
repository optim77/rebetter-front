import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios.ts";
import { authStore } from "@/store/auth.ts";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import toast from "react-hot-toast";
import { t } from "i18next";

interface LoginData {
    email: string;
    password: string;
}

export function useLogin() {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data: LoginData) => {
            const res = await api.post("/auth/login", data);
            authStore.setToken(res.data.token);
        },
        onSuccess: async () => {
            navigate("/dashboard");
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            console.log(apiError)
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Registration failed:", apiError);
        }
    });

    return {
        loginUser: mutation.mutate,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
    }
}