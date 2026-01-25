import { type JSX } from "react";
import { ListChecks, Plus } from "lucide-react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export const NoFoundSurveys = ({groupId}: {groupId: string | undefined}):JSX.Element => {
    return (
        <div className="rounded-lg border border-dashed py-16 text-center">
            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground/70"/>
            <h3 className="mt-4 text-lg font-medium">
                {t("surveys.no_surveys")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                {t("surveys.lack_of_surveys_description")}
            </p>
            <Button asChild className="mt-6" variant="outline">
                <Link to={`/dashboard/group/${groupId}/surveys/create`}>
                    <Plus className="mr-2 h-4 w-4"/>
                    {t("surveys.create_new_survey")}
                </Link>
            </Button>
        </div>
    )
}