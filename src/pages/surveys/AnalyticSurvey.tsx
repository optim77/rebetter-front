import { type JSX, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SurveysAPI } from "@/api/SurveysAPI.ts";
import { Star, MessageSquare, CheckSquare, Users, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type AnalyticRecord = {
    type: "text" | "choice" | "rating";
    label: string;
    required: boolean;
    options?: string[] | null;
    average_rating?: number | null;
    average_choice?: Record<string, number>;
    answers: {
        client_id: string;
        client_email: string;
        answer: string | number;
    }[];
};

type AnalyticSurveyData = {
    survey_id: string;
    name: string;
    description?: string;
    content: {
        records: AnalyticRecord[];
    };
    completed_times: number;
    users: {
        [key: string]: string;
    };
};

export const AnalyticSurvey = (): JSX.Element => {
    const { companyId, surveyId } = useParams<{ companyId: string; surveyId: string }>();
    const [openDialog, setOpenDialog] = useState<number | null>(null);
    const [expandedUsers, setExpandedUsers] = useState<boolean>(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["surveyAnalytic", companyId, surveyId],
        queryFn: () => SurveysAPI.getSurveyAnalytic(companyId!, surveyId!),
        enabled: !!companyId && !!surveyId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">{t("surveys.loading")}</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center bg-red-50 text-red-700 py-6 px-10 rounded-3xl shadow-lg">
                    <p className="text-xl font-semibold">{t("surveys.cannot_load")}</p>
                </div>
            </div>
        );
    }

    const survey: AnalyticSurveyData = data;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-12"
            >
                {/* Nagłówek */}
                <div className="flex items-center justify-between">
                    <Link to={`/dashboard/group/${companyId}/surveys`}>
                        <Button variant="ghost" className="rounded-2xl hover:bg-white/70 shadow-md">
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            {t("surveys.back_to_surveys")}
                        </Button>
                    </Link>

                    <div className="text-right">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {survey.name}
                        </h1>
                        <p className="text-gray-600 mt-2">{survey.description}</p>
                    </div>
                </div>

                {/* Liczba wypełnień */}
                <Card className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60">
                    <CardContent className="p-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl shadow-inner">
                                    <Users className="w-12 h-12 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-lg text-gray-600">{t("surveys.surveys_counter")}</p>
                                    <p className="text-5xl font-extrabold text-gray-800">{survey.completed_times}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista osób, które wypełniły ankietę – zwijana */}
                <Card className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
                        <h3 className="text-2xl font-bold flex items-center gap-4">
                            <Users className="w-8 h-8" />
                            {t("surveys.filled_by")}
                        </h3>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {Object.entries(survey.users).slice(0, expandedUsers ? undefined : 8).map(([clientId, clientName]) => (
                                <Link
                                    key={clientId}
                                    to={`/dashboard/group/${companyId}/client/${clientId}`}
                                    className="text-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:shadow-md transition-all"
                                >
                                    <p className="font-medium text-gray-800">{clientName}</p>
                                </Link>
                            ))}
                        </div>

                        {Object.keys(survey.users).length > 8 && (
                            <div className="text-center mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setExpandedUsers(!expandedUsers)}
                                    className="rounded-2xl"
                                >
                                    {expandedUsers ? (
                                        <>Ukryj <ChevronUp className="w-5 h-5 ml-2" /></>
                                    ) : (
                                        <>Pokaż więcej ({Object.keys(survey.users).length - 8}) <ChevronDown className="w-5 h-5 ml-2" /></>
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pytania – klikalne karty prowadzące do modala */}
                <div className="space-y-10">
                    {survey.content.records.map((record, index) => (
                        <Dialog key={index} open={openDialog === index} onOpenChange={(open) => setOpenDialog(open ? index : null)}>
                            <DialogTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="cursor-pointer"
                                >
                                    <Card className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/60 overflow-hidden transition-shadow hover:shadow-2xl">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-bold flex items-center gap-4">
                                                    {record.type === "rating" && <Star className="w-8 h-8" />}
                                                    {record.type === "choice" && <CheckSquare className="w-8 h-8" />}
                                                    {record.type === "text" && <MessageSquare className="w-8 h-8" />}
                                                    {record.label}
                                                    {record.required && <span className="text-sm font-normal opacity-80">({t("surveys.required")})</span>}
                                                </h3>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="secondary" className="text-lg px-4 py-2">
                                                        {record.answers.length} {t("surveys.answers")}
                                                    </Badge>
                                                    <ChevronRight className="w-6 h-6 opacity-70" />
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-10">
                                            {/* Podsumowanie w karcie */}
                                            {record.type === "rating" && record.average_rating && (
                                                <div className="text-center py-6">
                                                    <p className="text-lg text-gray-600 mb-4">{t("surveys.average_rating")}</p>
                                                    <div className="flex items-center justify-center gap-3">
                                                        <span className="text-5xl font-bold text-gray-800">
                                                            {record.average_rating.toFixed(1)}
                                                        </span>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-10 h-10 ${
                                                                        star <= Math.round(record.average_rating!)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {record.type === "choice" && record.average_choice && (
                                                <div className="space-y-4">
                                                    <p className="text-lg font-semibold text-gray-800">{t("surveys.responses_distribution")}</p>
                                                    {Object.entries(record.average_choice)
                                                        .sort(([, a], [, b]) => (b as number) - (a as number))
                                                        .slice(0, 3)
                                                        .map(([option, count]) => {
                                                            const percentage = ((count as number) / record.answers.length) * 100;
                                                            return (
                                                                <div key={option} className="flex items-center justify-between text-sm">
                                                                    <span className="font-medium text-gray-700 truncate max-w-xs">{option}</span>
                                                                    <span className="text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                                                                </div>
                                                            );
                                                        })}
                                                    {Object.keys(record.average_choice).length > 3 && (
                                                        <p className="text-center text-gray-500 italic pt-2">
                                                            ...i {Object.keys(record.average_choice).length - 3} więcej
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {record.type === "text" && (
                                                <div className="text-center py-6">
                                                    <p className="text-lg text-gray-600">
                                                        {record.answers.length} odpowiedzi tekstowych
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Kliknij, aby zobaczyć wszystkie
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </DialogTrigger>

                            {/* Modal ze szczegółami */}
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl">
                                <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-t-3xl">
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-4">
                                        {record.type === "rating" && <Star className="w-8 h-8" />}
                                        {record.type === "choice" && <CheckSquare className="w-8 h-8" />}
                                        {record.type === "text" && <MessageSquare className="w-8 h-8" />}
                                        {record.label}
                                    </DialogTitle>
                                </DialogHeader>

                                <ScrollArea className="p-8 pt-6 max-h-[60vh]">
                                    <div className="space-y-8">
                                        {/* Szczegóły dla rating */}
                                        {record.type === "rating" && (
                                            <div className="space-y-6">
                                                <div className="text-center py-6 border-b">
                                                    <p className="text-2xl font-bold text-gray-800">
                                                        Średnia: {record.average_rating?.toFixed(1)}
                                                    </p>
                                                    <div className="flex justify-center gap-2 mt-4">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-10 h-10 ${
                                                                    star <= (record.average_rating || 0)
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="font-semibold text-lg">Odpowiedzi poszczególnych klientów:</p>
                                                    {record.answers.map((ans, i) => (
                                                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                                            <Link
                                                                to={`/dashboard/group/${companyId}/client/${ans.client_id}`}
                                                                className="font-medium text-indigo-600 hover:underline"
                                                            >
                                                                {ans.client_email}
                                                            </Link>
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <Star
                                                                        key={s}
                                                                        className={`w-6 h-6 ${s <= (ans.answer as number) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Szczegóły dla choice */}
                                        {record.type === "choice" && (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    {Object.entries(record.average_choice || {})
                                                        .sort(([, a], [, b]) => (b as number) - (a as number))
                                                        .map(([option, count]) => {
                                                            const percentage = ((count as number) / record.answers.length) * 100;
                                                            return (
                                                                <div key={option} className="space-y-2">
                                                                    <div className="flex justify-between">
                                                                        <span className="font-medium">{option}</span>
                                                                        <span>{count} ({percentage.toFixed(0)}%)</span>
                                                                    </div>
                                                                    <Progress value={percentage} className="h-3" />
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                                <div className="space-y-3 pt-6 border-t">
                                                    <p className="font-semibold text-lg">Szczegóły odpowiedzi:</p>
                                                    {record.answers.map((ans, i) => (
                                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                                            <Link
                                                                to={`/dashboard/group/${companyId}/client/${ans.client_id}`}
                                                                className="text-indigo-600 hover:underline"
                                                            >
                                                                {ans.client_email}
                                                            </Link>
                                                            <span className="font-medium">{ans.answer}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Szczegóły dla text */}
                                        {record.type === "text" && (
                                            <div className="space-y-6">
                                                {record.answers.map((ans, i) => (
                                                    <div key={i} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md border border-gray-100">
                                                        <p className="italic text-gray-800 leading-relaxed text-lg">„{ans.answer}”</p>
                                                        <Link
                                                            to={`/dashboard/group/${companyId}/client/${ans.client_id}`}
                                                            className="inline-block mt-4 text-sm text-indigo-600 hover:underline font-medium"
                                                        >
                                                            — {ans.client_email}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};