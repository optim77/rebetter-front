import { MessageSquare } from "lucide-react";
import { t } from "i18next";
import { type JSX } from "react";

export const NoFoundMessages = ():JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/70 mb-4" />
            <h3 className="text-lg font-medium">{t("messages.no_messages_for_client")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                {t("messages.no_messages_description")}
            </p>
        </div>
    );
}