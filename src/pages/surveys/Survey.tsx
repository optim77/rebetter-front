import { type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SurveysAPI } from "@/api/SurveysAPI.ts";
import { t } from "i18next";
import { Loader } from "@/components/elements/Loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import { toast } from "react-hot-toast";

type QuestionType = "text" | "choice" | "rating";

type Question = {
    id: string;
    type: QuestionType;
    label: string;
    options?: string[];
};

export const Survey = (): JSX.Element => {
    const { companyId, surveyId } = useParams<{
        companyId: string;
        surveyId: string;
    }>() as { companyId: string; surveyId: string };

    const navigate = useNavigate();

    const {
        data: survey,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["survey", companyId, surveyId],
        queryFn: () => SurveysAPI.getSurvey(companyId, surveyId),
        enabled: !!companyId && !!surveyId
    });

    const deleteSurvey = useMutation({
        mutationFn: async () => {
            if (!companyId || !surveyId) throw new Error("Missing company or client ID!");
            await SurveysAPI.deleteSurvey(companyId, surveyId);
        },
        onSuccess: () => {
            toast.success(t("surveys.delete_surveys"));
            navigate(`/dashboard/company/${companyId}/surveys`);
        },
        onError: () => {
            const apiError: ApiError = handleApiError(error);
            console.log(apiError)
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("Registration failed:", apiError);
        }
    })

    if (isLoading) return <Loader />;

    if (isError) {
        return (
            <div className="p-6 text-red-500">
                {t("errors.error_fetching_survey")}
                <div className="text-sm opacity-70 mt-1">
                    {(error)?.message}
                </div>
            </div>
        );
    }

    if (!survey) {
        return <div className="p-6">{t("surveys.not_found_survey")}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-end gap-2">
                <Button className="cursor-pointer">{t("action.update")}</Button>
                <Button onClick={() => deleteSurvey.mutate()} className="cursor-pointer" variant="destructive">{t("action.delete")}</Button>
            </div>
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-semibold">
                        {survey.name}
                    </h1>
                    {survey.description && (
                        <p className="text-gray-500 mt-2">
                            {survey.description}
                        </p>
                    )}
                </CardHeader>
            </Card>

            <div className="space-y-4">
                {survey.content?.map((q: Question, index: number) => (
                    <Card key={q.id || index}>
                        <CardContent className="pt-4 space-y-3">
                            <Label className="text-sm font-semibold">
                                {index + 1}. {q.label}
                            </Label>

                            {q.type === "text" && (
                                <input
                                    disabled
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    placeholder="Odpowiedź tekstowa"
                                />
                            )}

                            {q.type === "choice" && (
                                <div className="space-y-2">
                                    {q.options?.map((opt, i) => (
                                        <label
                                            key={i}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                disabled
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {q.type === "rating" && (
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4, 5].map(n => (
                                        <div
                                            key={n}
                                            className="px-3 py-1 border rounded bg-gray-100 text-sm"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
