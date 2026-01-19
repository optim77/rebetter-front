import { useQuery } from "@tanstack/react-query";
import { GroupsApi, type Group } from "@/api/GroupsApi.ts";
import type { ApiError } from "@/types/apiError.ts";


export const useGroup = (groupId: string | undefined) => {
    const query = useQuery<Group, ApiError>({
        queryKey: ["company", groupId],
        queryFn: async (): Promise<Group> => {
            if (!groupId) throw new Error("Missing companyId");
            return await GroupsApi.getGroup(groupId);
        },
        enabled: !!groupId,
    });

    return { query };
};
