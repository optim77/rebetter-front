import { type JSX } from "react";
import { Send } from "lucide-react";
import { t } from "i18next";

export const ContactForm = (): JSX.Element => {
    return (
        <section id="contact" className="py-16 bg-gray-100 px-6">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    {t("contact.head")}
                </h2>
                <p className="text-gray-600 mb-6">
                    {t("contact.description")}
                </p>
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder={t("contact.your_name")}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <input
                        type="email"
                        placeholder={t("contact.email")}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <textarea
                        placeholder={t("contact.message")}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex justify-center items-center gap-2 transition"
                    >
                        <Send className="w-4 h-4"/> {t("action.send_message")}
                    </button>
                </form>
            </div>
        </section>
    )
}