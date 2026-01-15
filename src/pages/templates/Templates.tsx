import { type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";

export const Templates = ():JSX.Element => {
    const { companyId } = useParams<{ companyId: string }>();
    return (
        <>
            <Link to={`/dashboard/group/${companyId}/templates/create`}>{t("action.create")}</Link>
        </>
    )
}