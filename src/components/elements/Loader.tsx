import { type JSX } from "react";
import { Loader2 } from "lucide-react";
import { t } from "i18next";

export const Loader = ():JSX.Element => {
    return (
        <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">{t("action.loading")}</span>
        </div>
    );
}