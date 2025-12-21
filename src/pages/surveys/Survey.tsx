import { type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SurveysAPI } from "@/api/SurveysAPI.ts";
import { t } from "i18next";
import { Loader } from "@/components/elements/Loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { motion } from "framer-motion";
import { FileText, Edit3, Trash2, Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { handleApiError } from "@/utils/handleApiError.ts";
import toast from "react-hot-toast";

type QuestionType = "text" | "choice" | "rating";

type Question = {
    id: string;
    type: QuestionType;
    label: string;
    required: boolean;
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
            if (!companyId || !surveyId) throw new Error("Missing company or survey ID!");
            await SurveysAPI.deleteSurvey(companyId, surveyId);
        },
        onSuccess: () => {
            toast.success(t("surveys.delete_surveys"));
            navigate(`/dashboard/company/${companyId}/surveys`);
        },
        onError: (err) => {
            const apiError = handleApiError(err);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
        }
    });

    if (isLoading) return <Loader />;

    if (isError || !survey) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center bg-red-50 text-red-700 py-6 px-10 rounded-3xl shadow-lg">
                    <p className="text-xl font-semibold">{t("errors.error_fetching_survey")}</p>
                    {error && <p className="text-sm mt-2 opacity-80">{(error as Error).message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12 overflow-hidden relative">

            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
            >

                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60">

                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-10 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-extrabold flex items-center gap-4">
                                    <FileText className="w-12 h-12" />
                                    {survey.name}
                                </h1>
                                {survey.description && (
                                    <p className="mt-4 text-indigo-100 text-lg max-w-2xl">
                                        {survey.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => navigate(`/dashboard/company/${companyId}/survey/${surveyId}/edit`)}
                                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md"
                                >
                                    <Edit3 className="w-5 h-5 mr-2" />
                                    {t("action.update")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (confirm(t("surveys.confirm_delete"))) {
                                            deleteSurvey.mutate();
                                        }
                                    }}
                                    variant="destructive"
                                    className="bg-red-600/80 hover:bg-red-700"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    {t("action.delete")}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        {survey.content?.map((q: Question, index: number) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                        <span className="text-indigo-600 font-bold">{index + 1}.</span>
                                        {q.label}
                                        {q.required && <span className="text-red-500 ml-2">*</span>}
                                    </h3>

                                    <Badge variant="outline" className="capitalize">
                                        {q.type === "text" && <MessageSquare className="w-4 h-4 mr-1" />}
                                        {q.type === "choice" && <CheckCircle2 className="w-4 h-4 mr-1" />}
                                        {q.type === "rating" && <Star className="w-4 h-4 mr-1" />}
                                        {q.type}
                                    </Badge>
                                </div>

                                <div className="mt-6">
                                    {q.type === "text" && (
                                        <div className="w-full bg-white/70 border border-gray-200 rounded-2xl p-5 text-gray-600 italic">
                                            {t("surveys.text_response_example")}
                                        </div>
                                    )}

                                    {q.type === "choice" && q.options && (
                                        <div className="space-y-3">
                                            {q.options.map((opt, i) => (
                                                <label
                                                    key={i}
                                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white/60 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                                                >
                                                    <input type="radio" disabled className="w-5 h-5" />
                                                    <span className="font-medium text-gray-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "rating" && (
                                        <div className="flex justify-center gap-4 py-6">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <div
                                                    key={value}
                                                    className="text-5xl text-gray-300 hover:text-gray-400 transition-all duration-300"
                                                >
                                                    ★
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <Checkbox checked={q.required} disabled />
                                    <Label className="text-gray-600 font-medium">
                                        {t("surveys.required")}
                                    </Label>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};