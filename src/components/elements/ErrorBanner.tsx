import { type JSX } from "react";
import { AlertCircle } from "lucide-react";
import { t } from "i18next";

interface ErrorBannerProps {
    error: Error;
    error_translate: string
}

export const ErrorBanner = ({error, error_translate}: ErrorBannerProps):JSX.Element => {
    return (
        <div className="flex justify-center items-center text-destructive py-8">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{t(`errors.${error_translate}`)}: {(error as Error).message}</span>
        </div>
    );
}