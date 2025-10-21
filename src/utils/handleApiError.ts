import type { ApiError } from "@/types/apiError.ts";
import { AxiosError } from "axios";

export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
        const status = error.response?.status || 500;
        const message = (error.response?.data?.detail as string)
            || "Unexpected server error. Please try again later.";
        const details =
            typeof error.response?.data === "object"
                ? JSON.stringify(error.response?.data)
                : undefined;

            return {status, message, details};
    }
    return {
        status: 500,
        message: "Unknown error occurred",
    };
}