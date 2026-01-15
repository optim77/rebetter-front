import { type JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ListChecks, FileText } from "lucide-react";
import { Loader } from "@/components/elements/Loader";
import { ErrorBanner } from "@/components/elements/ErrorBanner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";
import { SurveysAPI } from "@/api/SurveysAPI";
import { motion } from "framer-motion";

export const Surveys = (): JSX.Element => {
    const { companyId } = useParams<{ companyId: string }>();

    const [page, setPage] = useState(1);
    const pageSize = 12; // więcej na stronie dzięki mniejszym kartom

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["surveys", companyId, page],
        queryFn: async () => SurveysAPI.fetchSurveys(companyId!, page, pageSize),
        enabled: !!companyId,
    });

    if (isLoading) return <Loader />;
    if (isError) return <ErrorBanner error={error} error_translate="error_fetching_surveys" />;

    const surveys = data?.items || [];
    const total = data?.total || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12">
            {/* Delikatne animowane blob'y w tle */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-7xl mx-auto"
            >
                {/* Nagłówek + przycisk tworzenia */}
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-10 border border-white/60">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {t("surveys.surveys")}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {total > 0 ? `${total} ${t("surveys.found_surveys")}` : t("surveys.no_surveys_yet")}
                            </p>
                        </div>

                        <Link to={`/dashboard/group/${companyId}/surveys/create`}>
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                                <Plus className="w-6 h-6 mr-3" />
                                {t("surveys.create_new_survey")}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Grid z ankietami */}
                {surveys.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {surveys.map((survey: any, index: number) => (
                            <motion.div
                                key={survey.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <Link to={`/dashboard/group/${companyId}/survey/${survey.id}`}>
                                    <div className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:-translate-y-3">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
                                                <FileText className="w-12 h-12" />
                                            </div>
                                        </div>

                                        {/* Treść karty */}
                                        <div className="p-8 text-center">
                                            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-3">
                                                {survey.name}
                                            </h2>
                                            <p className="text-gray-600 line-clamp-3 min-h-16">
                                                {survey.description || t("surveys.no_description")}
                                            </p>
                                            <Badge variant="secondary" className="mt-6 px-4 py-2">
                                                {format(new Date(survey.created_at), "dd MMM yyyy", { locale: pl })}
                                            </Badge>
                                        </div>

                                        {/* Dolna linia hover */}
                                        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                            <ListChecks className="w-16 h-16 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            {t("surveys.no_surveys")}
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Zacznij zbierać opinie od klientów, tworząc pierwszą ankietę.
                        </p>
                        <Link to={`/dashboard/group/${companyId}/surveys/create`}>
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-6 px-10 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                                <Plus className="w-6 h-6 mr-3" />
                                {t("surveys.create_new_survey")}
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Paginacja */}
                {total > pageSize && (
                    <div className="mt-12 flex justify-center items-center gap-6">
                        <Button
                            variant="outline"
                            size="lg"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-2xl shadow-md"
                        >
                            {t("common.previous")}
                        </Button>

                        <span className="text-gray-700 font-medium text-lg">
                            {t("common.page")} {page} / {Math.ceil(total / pageSize)}
                        </span>

                        <Button
                            variant="outline"
                            size="lg"
                            disabled={page >= Math.ceil(total / pageSize)}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-2xl shadow-md"
                        >
                            {t("common.next")}
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};