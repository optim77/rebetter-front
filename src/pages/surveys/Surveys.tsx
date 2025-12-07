import { type JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks } from "lucide-react";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { SurveysAPI } from "@/api/SurveysAPI";

export const Surveys = (): JSX.Element => {
    const { companyId } = useParams<{ companyId: string }>();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["surveys", companyId, page],
        queryFn: async () => SurveysAPI.fetchSurveys(companyId!, page, pageSize),
        enabled: !!companyId,
    });

    if (isLoading) return <Loader />;
    if (isError)
        return (
            <ErrorBanner error={error} error_translate="error_fetching_surveys" />
        );

    if (!data || data.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-10 text-muted-foreground">
                <ListChecks className="h-10 w-10 mb-3 opacity-60" />
                <p>{t("surveys.no_surveys")}</p>
                <Button asChild className="mt-4">
                    <Link to={`/dashboard/company/${companyId}/surveys/create`}>
                        <Plus className="h-4 w-4 mr-1" /> {t("surveys.create_new_survey")}
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-semibold">{t("surveys.surveys")}</p>

                <Button asChild>
                    <Link to={`/dashboard/company/${companyId}/surveys/create`}>
                        <Plus className="h-4 w-4 mr-1" /> {t("surveys.create_new_survey")}
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.items.map((survey) => (
                    <Link to={`/dashboard/company/${companyId}/survey/${survey.id}`} key={survey.id}>
                        <Card className="rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                            <CardContent className="p-4 space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-base font-semibold">{survey.name}</p>
                                    <Badge variant="outline">
                                        {format(new Date(survey.created_at), "dd MMM yyyy", {
                                            locale: pl,
                                        })}
                                    </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {survey.description || t("surveys.no_description")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="flex justify-between pt-3 border-t">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    {t("common.previous")}
                </Button>

                <span className="text-xs text-muted-foreground">
          {t("common.page")} {page} / {Math.ceil(data.total / pageSize)}
        </span>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= Math.ceil(data.total / pageSize)}
                    onClick={() => setPage((p) => p + 1)}
                >
                    {t("common.next")}
                </Button>
            </div>
        </div>
    );
};