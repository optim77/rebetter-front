import { type JSX } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SurveysAPI } from "@/api/SurveysAPI.ts";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Edit, Trash2, Star, MessageSquare, CheckCircle2, ChartNoAxesCombined } from "lucide-react";
import { handleApiError } from "@/utils/handleApiError.ts";
import toast from "react-hot-toast";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";

type QuestionType = "text" | "choice" | "rating";

type Question = {
    id: string;
    type: QuestionType;
    label: string;
    required: boolean;
    options?: string[];
};

export const Survey = (): JSX.Element => {
    const { groupId, surveyId } = useParams<{
        groupId: string;
        surveyId: string;
    }>() as { groupId: string; surveyId: string };

    const navigate = useNavigate();

    const {
        data: survey,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["survey", groupId, surveyId],
        queryFn: () => SurveysAPI.getSurvey(groupId, surveyId),
        enabled: !!groupId && !!surveyId,
    });

    const deleteSurvey = useMutation({
        mutationFn: async () => {
            if (!groupId || !surveyId) throw new Error("Missing company or survey ID!");
            await SurveysAPI.deleteSurvey(groupId, surveyId);
        },
        onSuccess: () => {
            toast.success(t("surveys.delete_surveys"));
            navigate(`/dashboard/group/${groupId}/surveys`);
        },
        onError: (err) => {
            const apiError = handleApiError(err);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
        },
    });

    if (isLoading) return <BaseSpinner />;

    if (isError || !survey) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium text-destructive">
                        {t("errors.error_fetching_survey")}
                    </p>
                    {error && <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>}
                    <Button asChild variant="outline" className="mt-6">
                        <Link to={`/dashboard/group/${groupId}/surveys`}>
                            {t("action.back_to_list")}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Nagłówek + akcje */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-semibold tracking-tight">{survey.name}</h1>
                    </div>
                    {survey.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{survey.description}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/group/${groupId}/survey/${surveyId}/analytics`}>
                            <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                            {t("surveys.analytics")}
                        </Link>
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/group/${groupId}/survey/${surveyId}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("action.update")}
                        </Link>
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm(t("surveys.confirm_delete"))) {
                                deleteSurvey.mutate();
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("action.delete")}
                    </Button>
                </div>
            </div>

            {/* Lista pytań */}
            <div className="space-y-6">
                {survey.content?.map((q: Question, index: number) => (
                    <Card key={q.id} className="border">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium leading-tight">
                                            {q.label}
                                            {q.required && <span className="text-destructive ml-1.5">*</span>}
                                        </h3>

                                        <Badge variant="outline" className="mt-2 text-xs">
                                            {q.type === "text" && (
                                                <>
                                                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                                                    {t("surveys.question_type_text")}
                                                </>
                                            )}
                                            {q.type === "choice" && (
                                                <>
                                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                                    {t("surveys.question_type_choice")}
                                                </>
                                            )}
                                            {q.type === "rating" && (
                                                <>
                                                    <Star className="mr-1.5 h-3.5 w-3.5" />
                                                    {t("surveys.question_type_rating")}
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Podgląd odpowiedzi */}
                            <div className="mt-4">
                                {q.type === "text" && (
                                    <div className="rounded border bg-muted/40 p-4 text-sm text-muted-foreground italic">
                                        {t("surveys.text_response_example")}
                                    </div>
                                )}

                                {q.type === "choice" && q.options && (
                                    <div className="space-y-3">
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 rounded border bg-background px-4 py-2.5 text-sm"
                                            >
                                                <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                                <span>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {q.type === "rating" && (
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <div
                                                key={value}
                                                className="flex h-10 w-10 items-center justify-center rounded border text-lg text-muted-foreground"
                                            >
                                                ★
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Wymagane */}
                            <div className="mt-6 flex items-center gap-2 pt-4 border-t">
                                <Checkbox checked={q.required} disabled id={`required-${q.id}`} />
                                <Label htmlFor={`required-${q.id}`} className="text-sm text-muted-foreground">
                                    {t("surveys.required")}
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};