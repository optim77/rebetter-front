import { type JSX } from "react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { t } from "i18next";

export const TextQuestion = ():JSX.Element => {
    return (
        <Textarea
            placeholder={t("surveys.enter_text")}
            className="min-h-[120px] resize-none"
        />
    )
}