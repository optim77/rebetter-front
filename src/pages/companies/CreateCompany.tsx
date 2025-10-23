import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { t } from "i18next";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import toast from "react-hot-toast";
import { companiesApi } from "@/api/companiesApi.ts";

export default function CreateCompany() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async () => {
            return await companiesApi.createCompany({name, description});
        },
        onSuccess: (data) => {
            toast.success(t("companies.created_successfully", { defaultValue: "Company created successfully!" }));
            navigate(`/dashboard/company/${data.id}`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            console.log(apiError)
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Registration failed:", apiError);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-6">
                <Building2 className="text-indigo-600 w-6 h-6" />
                <h1 className="text-2xl font-semibold text-gray-800">
                    {t("companies.create_title", { defaultValue: "Create Company" })}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-600 mb-1">
                        {t("companies.name", { defaultValue: "Company name" })}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder={t("companies.name_placeholder", { defaultValue: "Enter company name" })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">
                        {t("companies.description", { defaultValue: "Description" })}
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                        placeholder={t("companies.description_placeholder", { defaultValue: "Enter description (optional)" })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                >
                    {mutation.isPending
                        ? t("companies.creating", { defaultValue: "Creating..." })
                        : t("companies.create_button", { defaultValue: "Create Company" })}
                </button>
            </form>
        </div>
    );
}
