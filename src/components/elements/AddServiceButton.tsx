import { PlusCircle } from "lucide-react";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
    companyId: string;
}

export default function AddServiceButton({ companyId }: Props) {
    return (
        <Link to={`/dashboard/company/${companyId}/create_service`}>
            <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
            >
                <div className="h-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-10 group">
                    <PlusCircle className="w-20 h-20 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300 mb-6" />
                    <span className="text-2xl font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
                        {t("services.add_service")}
                    </span>
                    <p className="mt-4 text-gray-500 text-center max-w-xs">
                        Dodaj nową usługę i zacznij zbierać opinie od klientów
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}