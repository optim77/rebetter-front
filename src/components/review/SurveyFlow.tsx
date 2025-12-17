import { useState, type JSX, type FormEvent } from "react";
import { t } from "i18next";

interface SurveyFlowProps {
    service_name: string | null;
    service_id?: string | null;
    portal?: string | null;
    survey?: Survey;
    is_redirect: boolean;
    company_logo?: string;
    companyId: string | undefined;
    clientId: string | undefined;
    trackingId: string | undefined;
}

export type Survey = {
    id: string;
    name: string;
    description?: string;
    content: SurveyQuestion[];
};

export type SurveyQuestion = {
    id: string;
    label: string;
    required: boolean;
    type: "text" | "choice" | "rating";
    options?: string[];
};

export const SurveyFlow = ({
                               service_name,
                               portal,
                               survey,
                               is_redirect,
                               company_logo,
                               companyId,
                               clientId,
                               trackingId,
                           }: SurveyFlowProps): JSX.Element => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    if (!survey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
                <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">
                    <p className="text-center text-gray-600 text-lg">{t("feedback.no_survey")}</p>
                </div>
            </div>
        );
    }

    const handleChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        for (const question of survey.content) {
            if (question.required && !answers[question.id]) {
                setError("Uzupełnij wszystkie wymagane pytania");
                return;
            }
        }

        const payload = {
            survey_id: survey.id,
            answers,
            company_id: companyId,
            client_id: clientId,
            tracking_id: trackingId,
        };

        console.log("SEND SURVEY:", payload);

        if (is_redirect && portal) {
            window.location.href = portal;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
            <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                    {company_logo && (
                        <img
                            src={company_logo}
                            alt="Company logo"
                            className="h-12 mb-6 mx-auto rounded-lg shadow-lg"
                        />
                    )}

                    {service_name && (
                        <p className="text-center text-indigo-100 text-sm uppercase tracking-wider mb-2">
                            {service_name}
                        </p>
                    )}

                    <h2 className="text-3xl font-bold text-center">
                        {survey.name}
                    </h2>

                    {survey.description && (
                        <p className="text-center text-indigo-100 mt-4 max-w-md mx-auto">
                            {survey.description}
                        </p>
                    )}
                </div>

                <div className="p-8 pt-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {survey.content.map((question, index) => (
                            <div
                                key={question.id}
                                className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg"
                            >
                                <p className="font-semibold text-gray-800 mb-4">
                                    {index + 1}. {question.label}
                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                </p>

                                {/* TEXT */}
                                {question.type === "text" && (
                                    <textarea
                                        rows={4}
                                        className="w-full resize-none rounded-2xl border border-gray-200 p-4 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition bg-white/70"
                                        placeholder="Twoja odpowiedź..."
                                        onChange={(e) => handleChange(question.id, e.target.value)}
                                    />
                                )}

                                {/* CHOICE */}
                                {question.type === "choice" && question.options && (
                                    <div className="space-y-3">
                                        {question.options.map(option => (
                                            <label
                                                key={option}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                                    ${answers[question.id] === option
                                                    ? "border-indigo-500 bg-indigo-50 shadow-md scale-105"
                                                    : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                                                }`}
                                            >
                                                <span className="font-medium text-gray-700">{option}</span>
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={option}
                                                    className="hidden"
                                                    checked={answers[question.id] === option}
                                                    onChange={() => handleChange(question.id, option)}
                                                />
                                                <div className={`w-5 h-5 rounded-full border-2 transition-all
                                                    ${answers[question.id] === option
                                                    ? "border-indigo-500 bg-indigo-500"
                                                    : "border-gray-300"
                                                }`}>
                                                    {answers[question.id] === option && (
                                                        <div className="w-full h-full rounded-full bg-white scale-50" />
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* RATING */}
                                {question.type === "rating" && (
                                    <div className="flex justify-center gap-4 py-4">
                                        {[1, 2, 3, 4, 5].map(value => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={`text-5xl transition-all duration-300 transform hover:scale-110 cursor-pointer
                                                    ${answers[question.id] >= value
                                                    ? "text-yellow-400 drop-shadow-lg"
                                                    : "text-gray-300 hover:text-gray-500"
                                                }`}
                                                onClick={() => handleChange(question.id, value)}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {error && (
                            <p className="text-center text-red-600 font-medium bg-red-50 py-3 rounded-xl">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            {t("action.send")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};