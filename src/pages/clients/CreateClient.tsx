import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clientsApi } from "@/api/clientsApi";
import { t } from "i18next";
import { toast } from "react-hot-toast";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";

export default function CreateClient() {
    const { companyId } = useParams<{ companyId: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        note: ""
    });

    const mutation = useMutation({
        mutationFn: async () =>
            clientsApi.createClient({
                ...form,
                company: companyId!,
            }),
        onSuccess: () => {
            toast.success(t("clients.created_successfully"));
            navigate(`/dashboard/company/${companyId}/clients`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            console.log(apiError)
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Registration failed:", apiError);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-semibold mb-4 text-indigo-600">
                {t("clients.add_client")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("clients.name")}
                    </label>
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("clients.name_placeholder")}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("clients.email")}
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@domain.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("clients.phone")}
                    </label>
                    <Input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+48 123 456 789"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("clients.service")}
                    </label>
                    <Input
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        placeholder={t("clients.service")}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t("clients.note")}
                    </label>
                    <Input
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        placeholder={t("clients.note")}
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
    );
}
