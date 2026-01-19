import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GroupsApi } from "@/api/GroupsApi.ts";
import toast from "react-hot-toast";
import { t } from "i18next";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";

export interface CreateCompanyForm {
    name: string;
    description: string;
    googleReviewLink?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    tiktokUrl?: string;
    znanyLekarzUrl?: string;
    booksyUrl?: string;
}

export const useCreateGroup = () => {
    const [form, setForm] = useState<CreateCompanyForm>({
        name: "",
        description: "",
        googleReviewLink: "",
        facebookUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
        tiktokUrl: "",
        znanyLekarzUrl: "",
        booksyUrl: "",
    });

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async () => {
            const filtered = Object.fromEntries(
                Object.entries(form).filter(([_, v]) => v && v.trim() !== "")
            );
            return await GroupsApi.createGroup(filtered);
        },
        onSuccess: (data) => {
            toast.success(
                t("groups.created_successfully", {
                    defaultValue: "Company created successfully!",
                })
            );
            navigate(`/dashboard/group/${data.id}`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Company creation failed:", apiError);
        },
    });

    const handleChange = (field: keyof CreateCompanyForm) => (value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return {
        handleSubmit,
        form,
        handleChange,
        mutation,
    };
};
