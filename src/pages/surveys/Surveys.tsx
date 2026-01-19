import { type JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ListChecks, FileText } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { SurveysAPI } from "@/api/SurveysAPI";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";
import { DEFAULT_PAGE_SIZE } from "@/components/pagination/consts.ts";

export const Surveys = (): JSX.Element => {
    const { groupId } = useParams<{ groupId: string }>();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["surveys", groupId, page, pageSize],
        queryFn: async () => SurveysAPI.fetchSurveys(groupId!, page, pageSize),
        enabled: !!groupId,
    });

    if (isLoading) return <Loader />;
    if (isError) return <ErrorBanner error={error} error_translate="error_fetching_surveys" />;

    const surveys = data?.items ?? [];
    const total = data?.total ?? 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("surveys.surveys")}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {total === 0
                            ? t("surveys.no_surveys_yet")
                            : `${total} ${t("surveys.found_surveys")}`}
                    </p>
                </div>

                <Button asChild size="sm">
                    <Link to={`/dashboard/group/${groupId}/surveys/create`}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("surveys.create_new_survey")}
                    </Link>
                </Button>
            </div>

            {surveys.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {surveys.map((survey: any) => (
                        <Link
                            key={survey.id}
                            to={`/dashboard/group/${groupId}/survey/${survey.id}`}
                            className="block transition-colors hover:bg-muted/40 rounded-lg"
                        >
                            <Card className="h-full border">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="mt-1 rounded-lg bg-muted p-2.5">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
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

                                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-xs">
                                            {format(new Date(survey.created_at), "dd MMM yyyy", { locale: pl })}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed py-16 text-center">
                    <ListChecks className="mx-auto h-12 w-12 text-muted-foreground/70" />
                    <h3 className="mt-4 text-lg font-medium">
                        {t("surveys.no_surveys")}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        Zacznij zbierać opinie od klientów, tworząc pierwszą ankietę.
                    </p>
                    <Button asChild className="mt-6" variant="outline">
                        <Link to={`/dashboard/group/${groupId}/surveys/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("surveys.create_new_survey")}
                        </Link>
                    </Button>
                </div>
            )}

            {total > pageSize && (
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        {t("common.page")} {page} {t("common.of")} {Math.ceil(total / pageSize)}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            {t("common.previous")}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= Math.ceil(total / pageSize)}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            {t("common.next")}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}