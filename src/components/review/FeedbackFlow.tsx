import { type JSX, useState } from "react";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { InvitationAPI } from "@/api/InvitationAPI.ts";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import { toast } from "react-hot-toast";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface FeedbackFlowProps {
    service_name: string | null;
    service_id?: string | null;
    portal?: string | null;
    feedback_question: string | null;
    is_redirect: boolean;
    company_logo?: string;
    companyId: string | undefined;
    clientId: string | undefined;
    trackingId: string | undefined;
}

export const FeedbackFlow = ({
                                 service_name,
                                 portal,
                                 feedback_question,
                                 is_redirect,
                                 company_logo,
                                 companyId,
                                 clientId,
                                 trackingId
                             }: FeedbackFlowProps): JSX.Element => {

    const [feedback, setFeedback] = useState("");

    const moveToPortal = () => {
        if (portal) {
            window.location.href = portal;
        }
    };

    const sendFeedback = useMutation({
        mutationFn: async () => {
            if (!feedback.trim()) {
                toast.error(t("feedback.missing_text"));
                return;
            }
            if (!companyId || !clientId || !trackingId) {
                throw new Error("Missing required parameters!");
            }
            return InvitationAPI.sendFeedback(companyId, clientId, trackingId, feedback.trim());
        },
        onSuccess: () => {
            toast.success(t("feedback.thanks"));
            if (is_redirect) moveToPortal();

        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t("errors.base_error"));
            console.error("Failed to send feedback:", apiError);
        }
    });

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-100 px-4">

            <motion.div
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl"
                animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-300/40 blur-3xl"
                animate={{ y: [0, -50, 0], x: [0, -20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-3xl p-8 text-center space-y-8"
            >

                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-2xl font-semibold text-slate-800 leading-snug"
                >
                    {feedback_question || t("feedback.default_question")}
                </motion.h2>

                {company_logo && (
                    <Avatar className="mx-auto w-20 h-20">
                        <AvatarImage src={company_logo} />
                    </Avatar>
                )}

                {service_name && (
                    <p className="text-slate-600 text-sm">
                        {t("feedback.rating_service")}: <strong>{service_name}</strong>
                    </p>
                )}

                <Textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t("invitation.placeholder")}
                    className="min-h-32 mt-4"
                />

                <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => sendFeedback.mutate()}
                    disabled={sendFeedback.isPending}
                >
                    {sendFeedback.isPending ? t("action.sending") : t("action.send")}
                </Button>
            </motion.div>
        </div>
    );
};
