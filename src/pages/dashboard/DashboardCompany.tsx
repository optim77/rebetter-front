import { type JSX } from "react";
import AddServiceButton from "@/components/elements/AddServiceButton.tsx";
import { useParams } from "react-router-dom";
import { useCompany } from "@/hooks/useCompany.ts";
import { motion } from "framer-motion";

export default function DashboardCompany(): JSX.Element {
    const { companyId } = useParams<{ companyId: string }>();
    const { query } = useCompany(companyId);

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
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto"
            >

                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-12">
                    {query.data?.name || "Dashboard firmy"}
                </h1>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AddServiceButton companyId={companyId!} />

                </div>
            </motion.div>
        </div>
    );
}