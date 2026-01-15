import { useState } from "react";
import { t } from "i18next";
import { useCreateCompany } from "@/hooks/useCreateCompany.ts";
import { motion } from "framer-motion";
import {
    Building2,
    Facebook,
    Instagram,
    Linkedin,
    Star,
    Stethoscope,
    Scissors,
    Video,
    Check,
} from "lucide-react";

const socialOptions = [
    { key: "googleReviewLink", label: "Google", icon: Star },
    { key: "facebookUrl", label: "Facebook", icon: Facebook },
    { key: "instagramUrl", label: "Instagram", icon: Instagram },
    { key: "linkedinUrl", label: "LinkedIn", icon: Linkedin },
    { key: "tiktokUrl", label: "TikTok", icon: Video },
    { key: "znanyLekarzUrl", label: "Znany Lekarz", icon: Stethoscope },
    { key: "booksyUrl", label: "Booksy", icon: Scissors },
];

export default function CreateCompany() {
    const [activeSocials, setActiveSocials] = useState<string[]>([]);

    const toggleSocial = (key: string) => {
        setActiveSocials((prev) =>
            prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
        );
    };

    const { handleSubmit, form, handleChange, mutation } = useCreateCompany();

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
                                <Building2 className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-extrabold">
                                {t("companies.create_title", { defaultValue: "Create Company" })}
                            </h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800">
                                {t("companies.name", { defaultValue: "Company name" })} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name")(e.target.value)}
                                className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner transition-all"
                                placeholder={t("companies.name_placeholder", { defaultValue: "Enter company name" })}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-gray-800">
                                {t("companies.description", { defaultValue: "Description" })}
                            </label>
                            <textarea
                                value={form.description || ""}
                                onChange={(e) => handleChange("description")(e.target.value)}
                                rows={4}
                                className="w-full px-6 py-4 text-base rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner resize-none transition-all"
                                placeholder={t("companies.description_placeholder", { defaultValue: "Enter description (optional)" })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-gray-800">
                                {t("companies.social_media")}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {socialOptions.map(({ key, label, icon: Icon }) => {
                                    const isActive = activeSocials.includes(key);
                                    return (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            key={key}
                                            onClick={() => toggleSocial(key)}
                                            className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 shadow-md ${
                                                isActive
                                                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700"
                                                    : "border-gray-200 bg-white/60 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <Icon className={`w-8 h-8 ${isActive ? "text-indigo-600" : "text-gray-500"}`} />
                                            <span className="text-sm font-semibold">{label}</span>
                                            {isActive && (
                                                <Check className="absolute top-2 right-2 w-5 h-5 text-indigo-600" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {activeSocials.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 pt-6 border-t border-gray-200"
                            >
                                <p className="text-lg font-semibold text-gray-800">Podaj linki:</p>
                                {activeSocials.map((key) => {
                                    const option = socialOptions.find((opt) => opt.key === key);
                                    const label = option?.label || key;

                                    return (
                                        <div key={key} className="space-y-2">
                                            <label className="text-base font-medium text-gray-700 flex items-center gap-2">
                                                {option && <option.icon className="w-5 h-5 text-gray-600" />}
                                                {label} URL
                                            </label>
                                            <input
                                                type="url"
                                                value={(form[key as keyof typeof form] as string) || ""}
                                                onChange={(e) => handleChange(key as keyof typeof form)(e.target.value)}
                                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner transition-all"
                                                placeholder={`https://...`}
                                            />
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full py-6 text-xl font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {mutation.isPending
                                    ? t("companies.creating", { defaultValue: "Creating..." })
                                    : t("companies.create_button", { defaultValue: "Create Company" })}
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}