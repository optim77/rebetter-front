import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { UserPlus, Mail, Phone, Briefcase, NotepadText } from "lucide-react";
import { clientsApi } from "@/api/clientsApi";
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
        note: "",
        company: companyId,
    });

    const mutation = useMutation({
        mutationFn: async () => clientsApi.createClient(form, companyId!),
        onSuccess: () => {
            toast.success(t("clients.created_successfully"));
            navigate(`/dashboard/company/${companyId}/clients`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto"
            >
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-10 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                                <UserPlus className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-extrabold">
                                {t("clients.add_client")}
                            </h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-indigo-600" />
                                {t("clients.name")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner transition-all"
                                placeholder={t("clients.name_placeholder")}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-indigo-600" />
                                {t("clients.email")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-6 py-4 text-base rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner transition-all"
                                placeholder="email@domain.com"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-indigo-600" />
                                {t("clients.phone")}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full px-6 py-4 text-base rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner transition-all"
                                placeholder="+48 123 456 789"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                {t("clients.service")}
                            </label>
                            <input
                                type="text"
                                name="service"
                                value={form.service}
                                onChange={handleChange}
                                className="w-full px-6 py-4 text-base rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner transition-all"
                                placeholder={t("clients.service_placeholder", { defaultValue: "Np. Strzyżenie męskie" })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <NotepadText className="w-5 h-5 text-indigo-600" />
                                {t("clients.note")}
                            </label>
                            <textarea
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-6 py-4 text-base rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner resize-none transition-all"
                                placeholder={t("clients.note_placeholder", { defaultValue: "Dodatkowe informacje o kliencie..." })}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full py-6 text-xl font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {mutation.isPending ? t("action.saving") : t("action.save")}
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}