import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { type JSX } from "react";

export default function Registered(): JSX.Element {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex justify-center mb-6">
                    <MailCheck className="w-16 h-16 text-indigo-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    {t("auth.registration_success")}
                </h1>

                <p className="text-gray-600 mb-8">
                    {t("auth.check_email_description")}
                </p>

                <Link
                    to="/login"
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                    {t("auth.go_to_login")}
                </Link>
            </motion.div>
        </div>
    );
}
