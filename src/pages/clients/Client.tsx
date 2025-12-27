import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, User, Edit3, Trash2, MessageSquareText } from "lucide-react";
import { t } from "i18next";
import { clientsApi } from "@/api/clientsApi.ts";
import { ClientMessagesList } from "@/components/client/ClientMessagesList.tsx";
import { motion } from "framer-motion";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company_id: string;
}

export default function Client() {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();

    const { data: client, isLoading, isError } = useQuery({
        queryKey: ["client", companyId, clientId],
        queryFn: async (): Promise<Client> => {
            if (!companyId || !clientId) throw new Error("Missing IDs");
            return clientsApi.getClient(companyId, clientId);
        },
        enabled: !!companyId && !!clientId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">{t("action.loading")}...</p>
            </div>
        );
    }

    if (isError || !client) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center bg-red-50 text-red-700 py-6 px-10 rounded-3xl shadow-lg">
                    <p className="text-xl font-semibold">{t("errors.client_not_found")}</p>
                </div>
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
                className="max-w-6xl mx-auto space-y-10"
            >
                <div className="flex items-center gap-4">
                    <Link to={`/dashboard/company/${companyId}/clients`}>
                        <Button variant="ghost" className="rounded-2xl hover:bg-white/70 shadow-md">
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            {t("action.back")}
                        </Button>
                    </Link>

                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {client.name}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden h-full">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-10 text-white">
                                <div className="w-22 h-22 mx-auto bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl">
                                    <User className="w-10 h-10" />
                                </div>
                            </div>

                            <CardContent className="p-10 space-y-8 text-center">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{t("clients.email")}</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <Mail className="w-5 h-5 text-indigo-600" />
                                        <p className="text-xl font-semibold text-gray-800">
                                            {client.email || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{t("clients.phone")}</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <Phone className="w-5 h-5 text-indigo-600" />
                                        <p className="text-xl font-semibold text-gray-800">
                                            {client.phone || "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-6 border-t border-gray-200">
                                    <Link to="send_email">
                                        <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                                            <Mail className="w-10 h-5 mr-2" />
                                            {t("messages.send_email_message")}
                                        </Button>
                                    </Link>

                                    <Link to="send_sms">
                                        <Button className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
                                            <MessageSquareText className="w-10 h-5 mr-2" />
                                            {t("messages.send_sms_message")}
                                        </Button>
                                    </Link>

                                    <Button variant="outline" className="w-full rounded-2xl hover:bg-indigo-50">
                                        <Edit3 className="w-5 h-5 mr-2" />
                                        {t("action.edit")}
                                    </Button>

                                    <Button variant="destructive" className="w-full rounded-2xl">
                                        <Trash2 className="w-5 h-5 mr-2" />
                                        {t("action.delete")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 h-full">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <MessageSquareText className="w-8 h-8" />
                                    {t("messages.history")}
                                </h2>
                            </div>
                            <CardContent className="p-6 border-t border-gray-200">
                                <ClientMessagesList />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}