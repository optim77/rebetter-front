import { type JSX } from "react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

interface Props {
    groupId: string | undefined;
    clientId: string | undefined;
}

export const NoFoundMessage = ({groupId, clientId}: Props):JSX.Element => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <p className="text-lg font-medium text-destructive">
                    {t("messages.message_not_found")}
                </p>
                <Button asChild variant="outline" className="mt-4">
                    <Link to={`/dashboard/group/${groupId}/client/${clientId}`}>
                        {t("action.back")}
                    </Link>
                </Button>
            </div>
        </div>
    )
}