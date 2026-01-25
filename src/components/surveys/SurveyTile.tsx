import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { FileText } from "lucide-react";
import { t } from "i18next";
import { Badge } from "@/components/ui/badge.tsx";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Link } from "react-router-dom";
import type { Survey } from "@/api/SurveysAPI.ts";

interface Props {
    groupId: string | undefined;
    survey: Survey;
}

export const SurveyTile = ({groupId, survey}: Props):JSX.Element => {
    return (
        <Link
            key={survey.id}
            to={`/dashboard/group/${groupId}/survey/${survey.id}`}
            className="block transition-colors hover:bg-muted/40 rounded-lg"
        >
            <Card className="h-full border">
                <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="mt-1 rounded-lg bg-muted p-2.5">
                            <FileText className="h-5 w-5 text-muted-foreground"/>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium leading-tight line-clamp-2">
                                {survey.name}
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {survey.description || t("surveys.no_description")}
                            </p>
                        </div>
                    </div>

                    <div
                        className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                            {format(new Date(survey.created_at), "dd MMM yyyy", {locale: pl})}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}