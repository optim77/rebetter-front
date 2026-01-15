import { t } from "i18next";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import { servicesApi } from "@/api/servicesApi.ts";

export default function CreateService() {
    const { companyId } = useParams<{ companyId: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",

    });

    const mutation = useMutation({
        mutationFn: async () =>
            servicesApi.createService(form, companyId),
        onSuccess: () => {
            toast.success(t("services.created_successfully"));
            navigate(`/dashboard/group/${companyId}/services`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            console.log(apiError)
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Create service failed:", apiError);
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-semibold mb-4 text-indigo-600">
                {t("services.add_service")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("services.name")}
                    </label>
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("services.name_placeholder")}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("services.description")}
                    </label>
                    <Textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder={t("services.description")}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? t("action.saving") : t("action.save")}
                </Button>
            </form>
        </div>
    )
}