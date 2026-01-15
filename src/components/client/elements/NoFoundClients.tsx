import type { JSX } from "react";
import { Plus, User } from "lucide-react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

interface IProps {
    groupId: string | undefined;
}

export const NoFoundClients = ({groupId}: IProps):JSX.Element => {
    return (
        <div className="rounded-lg border border-dashed p-12 text-center">
            <User className="mx-auto h-10 w-10 text-muted-foreground/60"/>
            <h3 className="mt-4 text-base font-medium">
                {t("clients.no_clients_found")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                {t("clients.try_add_first")}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-6">
                <Link to={`/dashboard/group/${groupId}/create_client`}>
                    <Plus className="mr-2 h-4 w-4"/>
                    {t("clients.add_client")}
                </Link>
            </Button>
        </div>
    )
}