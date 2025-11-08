import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Services, servicesApi } from "@/api/servicesApi.ts";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";

interface Props {
    onSelect: (e: string) => void;
    selected: string | undefined;
}

export const ServiceForMessageSelector = ({ onSelect, selected }: Props): JSX.Element => {
    const { companyId } = useParams<{ companyId: string; clientId: string }>();

    const {
        data: serviceData,
        isLoading: isLoadingService,
        isError: isErrorService,
    } = useQuery({
        queryKey: ["service", companyId],
        queryFn: async (): Promise<Services> => {
            if (!companyId) throw new Error("Missing company ID!");
            return servicesApi.getServices(companyId);
        },
        enabled: !!companyId,
    });

    if (isLoadingService) {
        return <p>{t("action.loading")}...</p>;
    }

    if (isErrorService) {
        return <p className="text-red-500">{t("errors.data_loading_failed")}</p>;
    }

    if (!serviceData?.items?.length) {
        return (
            <Link
                to={`/dashboard/company/${companyId}/create_service`}
                className="text-blue-600 underline"
            >
                {t("services.add_services_info")}
            </Link>
        );
    }

    return (
        <div className="space-y-1">
            <label className="block mb-1 text-sm font-medium">{t("services.select_service")}</label>

            <Select value={selected} onValueChange={onSelect}>
                <SelectTrigger>
                    <SelectValue placeholder={t("action.choose")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t("services.services")}</SelectLabel>
                        {serviceData.items.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                                {service.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
