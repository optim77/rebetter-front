import { Card } from "@/components/ui/card"
import { t } from "i18next"
import { PlusCircle } from "lucide-react"
import { Link, useParams } from "react-router-dom";

export default function AddServiceButton() {
    const { companyId } = useParams<{ companyId: string }>();
    return (
        <Link to={`/dashboard/company/${companyId}/create_service`}>
            <Card
                role="button"
                tabIndex={0}
                className="
                w-full
                flex flex-col items-center justify-center
                py-10 cursor-pointer
                border-2 border-dashed border-gray-300
                hover:border-blue-500 hover:bg-blue-50
                transition-all duration-200
                rounded-2xl
                text-gray-600 hover:text-blue-600
                group
            "
            >
                <PlusCircle className="w-10 h-10 mb-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-lg font-medium">{t("services.add_service")}</span>
            </Card>
        </Link>

    )
}
