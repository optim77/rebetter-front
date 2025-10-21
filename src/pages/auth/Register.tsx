import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { t } from "i18next";
import React, { useState } from "react";
import { useRegister } from "@/hooks/useRegister.ts";

export default function Register() {
    const { registerUser, isLoading } = useRegister();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerUser(form);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
                    {t("auth.register_description")}
                </h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-600 mb-1">{t("auth.email")}</label>
                        <div className="flex items-center border rounded-lg px-3 py-2">
                            <Mail className="text-gray-400 w-5 h-5 mr-2" />
                            <input
                                name="email"
                                type="email"
                                placeholder="you@company.com"
                                value={form.email}
                                onChange={handleChange}
                                className="flex-1 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">{t("auth.password")}</label>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
                            <Lock className="text-gray-400 w-5 h-5 mr-2" />
                            <input
                                name="password"
                                type="password"
                                placeholder="********"
                                value={form.password}
                                onChange={handleChange}
                                className="flex-1 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition ${
                            isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? t("auth.registering") : t("auth.sign_up")}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        {t("auth.sing_ip_question")}{" "}
                        <Link
                            to="/login"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            {t("auth.sign_in")}
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
