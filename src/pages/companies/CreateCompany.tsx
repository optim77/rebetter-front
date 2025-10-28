import {
    Building2,
    Facebook,
    Instagram,
    Linkedin,
    Star,
    Stethoscope,
    Scissors,
    Video,
} from "lucide-react";
import { t } from "i18next";
import { useState } from "react";
import { useCreateCompany } from "@/hooks/useCreateCompany.ts";

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
            prev.includes(key)
                ? prev.filter((s) => s !== key)
                : [...prev, key]
        );
    };

    const { handleSubmit, form, handleChange, mutation } = useCreateCompany();

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-6">
                <Building2 className="text-indigo-600 w-6 h-6" />
                <h1 className="text-2xl font-semibold text-gray-800">
                    {t("companies.create_title", { defaultValue: "Create Company" })}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Basic fields */}
                <div>
                    <label className="block text-gray-600 mb-1">
                        {t("companies.name", { defaultValue: "Company name" })}
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name")(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder={t("companies.name_placeholder", {
                            defaultValue: "Enter company name",
                        })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">
                        {t("companies.description", { defaultValue: "Description" })}
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange("description")(e.target.value)}
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                        placeholder={t("companies.description_placeholder", {
                            defaultValue: "Enter description (optional)",
                        })}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        {t("companies.social_media", { defaultValue: "Social Media Links" })}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {socialOptions.map(({ key, label, icon: Icon }) => (
                            <button
                                type="button"
                                key={key}
                                onClick={() => toggleSocial(key)}
                                className={`flex items-center gap-2 border rounded-lg px-3 py-2 transition ${
                                    activeSocials.includes(key)
                                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                                        : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${
                                        activeSocials.includes(key)
                                            ? "text-indigo-600"
                                            : "text-gray-500"
                                    }`}
                                />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {activeSocials.map((key) => {
                        const label =
                            socialOptions.find((opt) => opt.key === key)?.label || key;

                        return (
                            <div key={key}>
                                <label className="block text-gray-600 mb-1">{label} URL</label>
                                <input
                                    type="text"
                                    value={form[key as keyof typeof form] ?? ""}
                                    onChange={(e) =>
                                        handleChange(key as keyof typeof form)(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    placeholder={`Enter ${label} link`}
                                />
                            </div>
                        );
                    })}
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
