import { type ChangeEvent, type FormEvent, type JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
        type: "redirect"
    });


    useEffect(() => {
        if (userData?.phone) {
            setForm((prev) => ({...prev, phone: userData.phone}));
        }
    }, [userData]);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!companyId || !clientId) throw new Error("Missing company or client ID!");
            return SMSMessagesAPI.createMessage(form, companyId, clientId);
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
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
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
                    <RadioGroup
                        value={form.type}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="redirect" id="redirect" />
                            <Label htmlFor="redirect">{t("common.simple_redirect")}</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="rating" id="rating" />
                            <Label htmlFor="rating">{t("common.rating")}</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="survey" id="survey" />
                            <Label htmlFor="survey">{t("common.survey")}</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">{t("sms.phone")}</label>
                    <Input
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={t("sms.enter_phone") || ""}
                        required
                    />
                </div>

                <ServiceForMessageSelector
                    onSelect={(value) => setForm((prev) => ({...prev, service: value}))}
                    selected={form.service}
                />

                <SocialLinksForMessageSelector
                    onSelect={(social) => setForm((prev) => ({...prev, platform: social.social }))}
                />

                <div>
                    <label className="block mb-1 text-sm font-medium">{t("sms.message")}</label>
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
