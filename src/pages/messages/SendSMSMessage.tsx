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
import { SurveysAPI } from "@/api/SurveysAPI.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { TooltipHelper } from "@/components/elements/TooltipHelper.tsx";

export const SendSMSMessage = (): JSX.Element => {
    const {companyId, clientId} = useParams<{ companyId: string; clientId: string }>();
    const navigate = useNavigate();


    const {
        data: userData,
        isLoading: isLoadingUser,
        isError: isErrorUser,
    } = useQuery({
        queryKey: ["client", companyId, clientId],
        queryFn: async (): Promise<Client> => {
            if (!companyId || !clientId) throw new Error("Missing company or client ID!");
            return clientsApi.getClient(companyId, clientId);
        },
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
            setForm((prev) => ({...prev, phone: userData.phone}));
        }
    }, [userData]);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!companyId || !clientId) throw new Error("Missing company or client ID!");

            const payload = {
                ...form,
                ...(form.type === "rating" && {
                    ratingQuestion: form.ratingQuestion
                }),
                ...(form.type === "survey" && {
                    surveyId: form.surveyId
                }),
                ...(form.surveyId != "" ? {
                    surveyId: form.surveyId
                } : {surveyId: undefined}),
            };

            return SMSMessagesAPI.createMessage(payload, companyId, clientId);
        },
        onSuccess: () => {
            toast.success(t("common.sent_successfully"));
            navigate(`/dashboard/company/${companyId}/clients`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
            console.error("SMS sending failed:", apiError);
        },
    });

    const {
        data: surveysData,
        isLoading: isLoadingSurveys,
    } = useQuery({
        queryKey: ["surveys", companyId],
        queryFn: () => {
            if (!companyId) throw new Error("Missing company ID");
            return SurveysAPI.fetchSurveys(companyId,1, 100);
        },
        enabled: form.type === "survey" && !!companyId
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (form.isRedirect && !form.platform) {
            toast.error(t("messages.select_platform_for_redirect"))
            return
        }
        mutation.mutate();
    };

    if (isLoadingUser) {
        return <p>{t("action.loading")}...</p>;
    }

    if (isErrorUser) {
        return <p className="text-red-500">{t("errors.data_loading_failed")}</p>;
    }

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-2xl shadow">
            <h1 className="text-xl font-semibold mb-4">{t("sms.send_message")}</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="flex gap-2">
                        <label className="block mb-1 text-sm font-medium">{t("sms.phone")}</label>
                        <TooltipHelper content={t("messages.phone_number_info")}/>
                    </div>
                    <Input
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={t("sms.enter_phone") || ""}
                        required
                    />
                </div>

                <div>
                    <Label className="block mb-1 text-sm font-medium">{t("messages.message_type")}</Label>
                    <RadioGroup
                        value={form.type}
                        id="messageType"
                        onValueChange={(value) => setForm((prev) => ({...prev, type: value}))}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="feedback" id="feedback"/>
                            <Label htmlFor="feedback">{t("common.simple_feedback")}</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3"/>
                                </TooltipTrigger>
                                <TooltipContent className="w-50 p-5">
                                    {t("messages.redirect_description")}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {form.type === "feedback" && (
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    {t("messages.feedback_question")}
                                </label>
                                <Input
                                    name="feedbackQuestion"
                                    value={form.feedbackQuestion}
                                    onChange={handleChange}
                                    placeholder={t("messages.enter_feedback_question") || ""}
                                    required
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="rating" id="rating"/>
                            <Label htmlFor="rating">{t("common.rating")}</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3"/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {t("messages.rating_description")}
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {form.type === "rating" && (
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    {t("messages.rating_question")}
                                </label>
                                <Input
                                    name="ratingQuestion"
                                    value={form.ratingQuestion}
                                    onChange={handleChange}
                                    placeholder={t("messages.enter_rating_question") || ""}
                                    required
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="survey" id="survey"/>
                            <Label htmlFor="survey">{t("common.survey")}</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3"/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {t("messages.survey_description")}
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {form.type === "survey" && (
                            <div className="space-y-1">
                                <label className="block text-sm font-medium">
                                    {t("messages.select_survey")}
                                </label>

                                {isLoadingSurveys ? (
                                    <div className="text-sm text-gray-500">
                                        {t("action.loading")}...
                                    </div>
                                ) : (
                                    <>
                                        <Select
                                            value={form.surveyId}
                                            onValueChange={(value) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    surveyId: value
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={t("messages.choose_survey")}
                                                />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {surveysData?.items?.map((survey: any) => (
                                                    <SelectItem
                                                        key={survey.id}
                                                        value={survey.id}
                                                    >
                                                        {survey.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Link target="_blank"
                                              to={`/dashboard/company/${companyId}/surveys`}>{t("messages.your_surveys")}</Link>
                                    </>

                                )}
                            </div>
                        )}
                    </RadioGroup>
                </div>


                <ServiceForMessageSelector
                    onSelect={(value) => setForm((prev) => ({...prev, service: value}))}
                    selected={form.service}
                />

                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">

                        <Checkbox
                            id="isRedirect"
                            checked={form.isRedirect}
                            onCheckedChange={(checked) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isRedirect: checked === true,
                                }))
                            }
                        />
                        <Label htmlFor="terms">{t("messages.redirect_after_action")}</Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3"/>
                            </TooltipTrigger>
                            <TooltipContent>
                                {t("messages.redirect_after_action_description")}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <SocialLinksForMessageSelector
                    isRequired={form.isRedirect}
                    disabled={!form.isRedirect}
                    onSelect={(social) => setForm((prev) => ({...prev, platform: social.social}))}
                />

                <div>
                    <div className="flex items-center gap-3">
                        <label className="block mb-1 text-sm font-medium">{t("sms.message")}</label>
                        <TooltipHelper content={t("messages.message")}/>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700 transition justify-end cursor-pointer"
                                >

                                    {t("messages.see_display")}
                                </button>
                            </TooltipTrigger>

                            <TooltipContent side="right" className="p-0 bg-transparent border-none shadow-none">
                                <div className="w-[320px] bg-gray-100 rounded-2xl shadow-lg p-4">

                                    <div className="bg-white rounded-xl p-3 shadow-inner border flex flex-col gap-2">

                                        <div className="text-xs text-gray-500 text-center">
                                            SMS
                                        </div>

                                        <div className="flex justify-start">
                                            <div
                                                className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-bl-md max-w-[85%] text-sm whitespace-pre-wrap break-words shadow">
                                                {form.message || t("messages.preview_placeholder")}
                                                <br/>
                                                {t("messages.link_to_message_preview")}
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-gray-400 text-right">
                                            {new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                                        </div>
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder={t("sms.enter_message") || ""}
                        className="w-full border rounded-md p-2 h-32 resize-none"
                        required
                    />
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? t("action.sending") : t("action.send")}
                </Button>
            </form>

        </div>
    );
};
