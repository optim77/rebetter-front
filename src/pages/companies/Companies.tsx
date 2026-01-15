import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { companiesApi, type Company } from "@/api/companiesApi.ts";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export default function Companies() {
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["companies", search],
        queryFn: () => companiesApi.getCompanies({ search_term: search }),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">{t("action.loading")}...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-7xl mx-auto"
            >
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-10 border border-white/60">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {t("companies.companies")}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {data?.total ? `${data.total} ${t("companies.found_companies")}` : t("companies.no_companies")}
                            </p>
                        </div>

                        <Link to="/dashboard/create_company">
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                                <PlusCircle className="w-6 h-6 mr-3" />
                                {t("companies.add_company")}
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8">
                        <Input
                            placeholder={t("action.search")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full max-w-md text-base py-6 rounded-2xl border-gray-200 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner"
                        />
                    </div>
                </div>

                {data?.items && data.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.items.map((company: Company, index: number) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <Link to={`/dashboard/group/${company.id}`}>
                                    <div className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:-translate-y-3">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
                                                <Building2 className="w-12 h-12" />
                                            </div>
                                        </div>

                                        <div className="p-8 text-center">
                                            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                {company.name}
                                            </h2>
                                            {company.description ? (
                                                <p className="mt-4 text-gray-600 leading-relaxed">
                                                    {company.description}
                                                </p>
                                            ) : (
                                                <p className="mt-4 text-gray-400 italic">
                                                    {t("companies.no_description")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Building2 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <p className="text-xl text-gray-600">{t("companies.no_companies_found")}</p>
                        <p className="text-gray-500 mt-2">{t("companies.try_add_first")}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}