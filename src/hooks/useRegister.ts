import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import toast from "react-hot-toast";
import { t } from "i18next";

interface RegisterData {
    email: string;
    password: string;
}

export function useRegister() {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data: RegisterData) => {
            await authApi.register(data);
        },
        onSuccess: () => {
            navigate("/registered");
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            console.log(apiError)
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Registration failed:", apiError);
        },
    });

    return {
        registerUser: mutation.mutate,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
    };
}
