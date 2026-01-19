import { type JSX } from "react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

interface Props {
    groupId: string | undefined;
}

export const EditClientNoFound = ({groupId}: Props):JSX.Element => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <p className="text-lg font-medium text-destructive">
                    {t("errors.client_not_found")}
                </p>
                <Button asChild variant="outline" className="mt-4">
                    <Link to={`/dashboard/group/${groupId}/clients`}>
                        {t("action.back_to_list")}
                    </Link>
                </Button>
            </div>
        </div>
    )
}