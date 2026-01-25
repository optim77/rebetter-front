import { type ChangeEvent, type JSX, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { t } from "i18next";
import { type Survey, SurveysAPI } from "@/api/SurveysAPI";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";
import { DEFAULT_PAGE_SIZE } from "@/components/pagination/consts.ts";
import { NoFoundSurveys } from "@/components/surveys/NoFoundSurveys.tsx";
import { Pagination } from "@/components/pagination/Pagination.tsx";
import { PageSizeChange } from "@/components/pagination/PageSizeChange.tsx";
import { BaseSearchInput } from "@/components/elements/BaseSearchInput.tsx";
import { SurveyTile } from "@/components/surveys/SurveyTile.tsx";

export const Surveys = (): JSX.Element => {
    const { groupId } = useParams<{ groupId: string }>();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState("");

    const handlePageSizeChange = (newSize: string) => {
        const sizeNum = Number(newSize);
        setPageSize(sizeNum);
        setPage(1);
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["surveys", groupId, search, page, pageSize],
        queryFn: async () => SurveysAPI.fetchSurveys(groupId!, {
            search_term: search,
            page,
            size: pageSize,
        }),
        enabled: !!groupId,
        placeholderData: keepPreviousData,
    });

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

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
                        <Plus className="mr-2 h-4 w-4"/>
                        {t("surveys.create_new_survey")}
                    </Link>
                </Button>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <BaseSearchInput search={search} handleSearchChange={handleSearchChange}/>
                <PageSizeChange handlePageSizeChange={handlePageSizeChange} pageSize={pageSize}/>
            </div>

            {surveys.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {surveys.map((survey: Survey) => (
                        <SurveyTile groupId={groupId} survey={survey} />
                    ))}
                </div>
            ) : (
                <NoFoundSurveys groupId={groupId}/>
            )}

            {total > pageSize && (

                <Pagination
                    totalPages={Math.ceil(total / pageSize)}
                    pageSize={pageSize}
                    total={total}
                    page={page}
                    handlePageChange={() => setPage((p) => p - 1)}
                />

            )}
        </div>
    );
}