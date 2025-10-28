import { useQuery } from "@tanstack/react-query";
import { companiesApi, type Company } from "@/api/companiesApi.ts";
import type { ApiError } from "@/types/apiError.ts";


export const useCompany = (companyId: string | undefined) => {
    const query = useQuery<Company, ApiError>({
        queryKey: ["company", companyId],
        queryFn: async (): Promise<Company> => {
            if (!companyId) throw new Error("Missing companyId");
            return await companiesApi.getCompany(companyId);
        },
        enabled: !!companyId,
    });

    return { query };
};
