import axios from "axios";

export type ApiValidatorError = {
    field: string;
    message: string;
}

export type ApiError =
    | {type: "validation", error: ApiValidatorError}
    | {type: "not_found" }
    | { type: "unauthorized" }
    | { type: "unknown" };

export function parseApiError(error: unknown): ApiError {
    if (!axios.isAxiosError(error)) {
        return { type: "unknown" };
    }
    const status = error.response?.status;

    if (status === 422) {
        const errors =
            error.response?.data?.detail?.map((err: any) => ({
                field: err.loc?.[1] ?? "unknown",
                message: err.msg,
            })) ?? [];

        return { type: "validation", errors };
    }

    if (status === 404) return { type: "not_found" };
    if (status === 401 || status === 403) return { type: "unauthorized" };

    return { type: "unknown" };
}