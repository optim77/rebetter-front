import { type JSX } from "react";
import { Button } from "@/components/ui/button.tsx";
import { t } from "i18next";

interface Props {
    isPending: boolean;

}

export const FormSubmitButton = ({isPending}: Props):JSX.Element => {
    return (
        <div className="pt-4">
            <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                size="lg"
            >
                {isPending ? t("action.saving") : t("action.save")}
            </Button>
        </div>
    )
}