import { type JSX } from "react";
import { Building2, Plus } from "lucide-react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export const NoFoundGroups = ():JSX.Element => {
    return (
        <div className="rounded-lg border border-dashed py-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/70"/>
            <h3 className="mt-4 text-lg font-medium">
                {t("groups.no_companies_found")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                {t("groups.try_add_first")}
            </p>
            <Button asChild className="mt-6" variant="outline">
                <Link to="/dashboard/create_group">
                    <Plus className="mr-2 h-4 w-4"/>
                    {t("groups.add_group")}
                </Link>
            </Button>
        </div>
    )
}