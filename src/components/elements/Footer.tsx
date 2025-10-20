import { type JSX } from "react";
import { t } from "i18next";

export const Footer = (): JSX.Element => {
    return (
        <footer className="py-6 text-center text-gray-500 text-sm border-t">
            © {new Date().getFullYear()} ReBetter. {t("utils.all_rights_reserved")}.
        </footer>
    )
}