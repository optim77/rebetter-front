import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import { type Client, clientsApi } from "@/api/clientsApi.ts";
import { motion } from "framer-motion";

export default function Clients() {
    const { companyId } = useParams<{ companyId: string }>();
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["clients", companyId, search],
        queryFn: () => clientsApi.getClients(companyId!, { search_term: search }),
        enabled: !!companyId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">{t("action.loading")}...</p>
            </div>
        );
    }

    const clients = data?.data.items || [];
    const total = data?.data.total || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12">

            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div

                className="max-w-7xl mx-auto"
            >

                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-10 border border-white/60">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {t("clients.clients")}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {total > 0 ? `${total} ${t("clients.found_clients")}` : t("clients.no_clients")}
                            </p>
                        </div>

                        <Link to={`/dashboard/company/${companyId}/create_client`}>
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                                <PlusCircle className="w-6 h-6 mr-3" />
                                {t("clients.add_client")}
                            </Button>
                        </Link>
                    </div>


                    <Input
                        placeholder={t("action.search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md text-base py-6 rounded-2xl border-gray-200 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner"
                    />
                </div>


                {clients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clients.map((client: Client, index: number) => (
                            <motion.div
                                key={client.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <Link to={`/dashboard/company/${companyId}/client/${client.id}`}>
                                    <div className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:-translate-y-3">

                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
                                                <User className="w-12 h-12" />
                                            </div>
                                        </div>

                                        <div className="p-8 text-center">
                                            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                {client.name}
                                            </h2>
                                            {client.email ? (
                                                <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                                                    <Mail className="w-5 h-5" />
                                                    <p className="text-base">{client.email}</p>
                                                </div>
                                            ) : (
                                                <p className="mt-4 text-gray-400 italic">
                                                    {t("clients.no_email")}
                                                </p>
                                            )}
                                            {client.phone && (
                                                <p className="mt-3 text-gray-600">
                                                    {client.phone}
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
                        <User className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <p className="text-xl text-gray-600">{t("clients.no_clients_found")}</p>
                        <p className="text-gray-500 mt-2">{t("clients.try_add_first")}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}