import { type ChangeEvent, type FormEvent, type JSX, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type Client, clientsApi } from "@/api/clientsApi";
import { SMSMessagesAPI } from "@/api/SMSMessagesAPI";
import { toast } from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import type { ApiError } from "@/types/apiError";
import { SocialLinksForMessageSelector } from "@/components/messages/SocialLinksForMessageSelector.tsx";
import { ServiceForMessageSelector } from "@/components/messages/ServiceForMessageSelector.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { type Survey, SurveysAPI } from "@/api/SurveysAPI.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Info, MessageSquareText, Star, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { TooltipHelper } from "@/components/elements/TooltipHelper.tsx";
import { motion } from "framer-motion";

export const SendSMSMessage = (): JSX.Element => {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();
    const navigate = useNavigate();

    const { data: userData, isLoading: isLoadingUser, isError: isErrorUser } = useQuery({
        queryKey: ["client", companyId, clientId],
        queryFn: async (): Promise<Client> => clientsApi.getClient(companyId!, clientId!),
        enabled: !!companyId && !!clientId,
    });

    const [form, setForm] = useState({
        message: "",
        phone: "",
        service: "",
        platform: "",
        type: "feedback",
        isRedirect: false,
        ratingQuestion: "",
        feedbackQuestion: "",
        surveyId: "",
    });

    useEffect(() => {
        if (userData?.phone) {
            setForm((prev) => ({ ...prev, phone: userData.phone }));
        }
    }, [userData]);

    const mutation = useMutation({
        mutationFn: async () => {
            const payload: any = {
                ...form,
                ...(form.type === "rating" && { ratingQuestion: form.ratingQuestion }),
                ...(form.type === "feedback" && { feedbackQuestion: form.feedbackQuestion }),
                ...(form.type === "survey" && { surveyId: form.surveyId || undefined }),
            };
            return SMSMessagesAPI.createMessage(payload, companyId!, clientId!);
        },
        onSuccess: () => {
            toast.success(t("common.sent_successfully"));
            navigate(`/dashboard/company/${companyId}/clients`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
        },
    });

    const { data: surveysData, isLoading: isLoadingSurveys } = useQuery({
        queryKey: ["surveys", companyId],
        queryFn: () => SurveysAPI.fetchSurveys(companyId!, 1, 100),
        enabled: form.type === "survey" && !!companyId,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (form.isRedirect && !form.platform) {
            toast.error(t("messages.select_platform_for_redirect"));
            return;
        }
        mutation.mutate();
    };

    if (isLoadingUser) return <p>{t("action.loading")}...</p>;
    if (isErrorUser) return <p className="text-red-500">{t("errors.data_loading_failed")}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto"
            >
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-10 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                                <MessageSquareText className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-extrabold">
                                {t("sms.send_message")}
                            </h1>
                        </div>
                        <p className="mt-4 text-indigo-100">
                            do: <span className="font-semibold">{userData?.name}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    <MessageSquareText className="w-5 h-5 text-indigo-600" />
                                    {t("sms.phone")}
                                </Label>
                                <TooltipHelper content={t("messages.phone_number_info")} />
                            </div>
                            <Input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+48 123 456 789"
                                className="text-base py-6 rounded-2xl"
                                required
                            />
                        </div>

                        <div className="space-y-6">
                            <Label className="text-lg font-semibold">{t("messages.message_type")}</Label>
                            <RadioGroup value={form.type} onValueChange={(v) => setForm(prev => ({ ...prev, type: v as any }))}>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition">
                                        <RadioGroupItem value="feedback" id="feedback" />
                                        <Label htmlFor="feedback" className="flex-1 cursor-pointer">
                                            <div className="font-medium">{t("common.simple_feedback")}</div>
                                            <TooltipHelper content={t("messages.redirect_description")} />
                                        </Label>
                                        <Info className="w-5 h-5 text-gray-400" />
                                    </div>

                                    {form.type === "feedback" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="ml-10">
                                            <Input
                                                name="feedbackQuestion"
                                                value={form.feedbackQuestion}
                                                onChange={handleChange}
                                                placeholder={t("messages.enter_feedback_question")}
                                                className="py-5 rounded-2xl"
                                            />
                                        </motion.div>
                                    )}

                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition">
                                        <RadioGroupItem value="rating" id="rating" />
                                        <Label htmlFor="rating" className="flex-1 cursor-pointer">
                                            <div className="font-medium">{t("common.rating")}</div>
                                            <TooltipHelper content={t("messages.rating_description")} />
                                        </Label>
                                        <Star className="w-5 h-5 text-yellow-500" />
                                    </div>

                                    {form.type === "rating" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="ml-10">
                                            <Input
                                                name="ratingQuestion"
                                                value={form.ratingQuestion}
                                                onChange={handleChange}
                                                placeholder={t("messages.enter_rating_question")}
                                                className="py-5 rounded-2xl"
                                            />
                                        </motion.div>
                                    )}

                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition">
                                        <RadioGroupItem value="survey" id="survey" />
                                        <Label htmlFor="survey" className="flex-1 cursor-pointer">
                                            <div className="font-medium">{t("common.survey")}</div>
                                            <TooltipHelper content={t("messages.survey_description")} />
                                        </Label>
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>

                                    {form.type === "survey" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="ml-10 space-y-3">
                                            {isLoadingSurveys ? (
                                                <p className="text-sm text-gray-500">{t("action.loading")}...</p>
                                            ) : (
                                                <Select value={form.surveyId} onValueChange={(v) => setForm(prev => ({ ...prev, surveyId: v }))}>
                                                    <SelectTrigger className="py-6 rounded-2xl">
                                                        <SelectValue placeholder={t("messages.choose_survey")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {surveysData?.items?.map((s: Survey) => (
                                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            <Link target="_blank" to={`/dashboard/company/${companyId}/surveys`} className="text-indigo-600 hover:underline text-sm">
                                                {t("messages.your_surveys")}
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </RadioGroup>
                        </div>

                        <ServiceForMessageSelector
                            onSelect={(value) => setForm(prev => ({ ...prev, service: value }))}
                            selected={form.service}
                        />

                        <div className="flex items-center gap-4">
                            <Checkbox
                                checked={form.isRedirect}
                                onCheckedChange={(c) => setForm(prev => ({ ...prev, isRedirect: c === true }))}
                            />
                            <Label className="text-base font-medium cursor-pointer">
                                {t("messages.redirect_after_action")}
                            </Label>
                            <Tooltip>
                                <TooltipHelper content={t("messages.redirect_after_action_description")} />
                            </Tooltip>
                        </div>

                        <SocialLinksForMessageSelector
                            isRequired={form.isRedirect}
                            disabled={!form.isRedirect}
                            onSelect={(social) => setForm(prev => ({ ...prev, platform: social.social }))}
                        />

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    <MessageSquareText className="w-5 h-5 text-indigo-600" />
                                    {t("sms.message")}
                                </Label>
                                <TooltipHelper content={t("messages.message")} />
                            </div>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder={t("sms.enter_message")}
                                className="w-full h-40 px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-300 bg-white/70 shadow-inner resize-none"
                                required
                            />
                            <p className="text-sm text-gray-500 text-right">{form.message.length}/160 {t("common.characters")}</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60"
                        >
                            {mutation.isPending ? t("action.sending") : t("action.send")}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};