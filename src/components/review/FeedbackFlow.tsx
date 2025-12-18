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
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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
            if (is_redirect) moveToPortal();
            navigate('/post_feedback');
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t("errors.base_error"));
            console.error("Failed to send feedback:", apiError);
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12 overflow-hidden relative">
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
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60"
            >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-10 text-white">
                    {company_logo && (
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Avatar className="mx-auto w-24 h-24 shadow-2xl border-4 border-white/30">
                                <AvatarImage src={company_logo} />
                            </Avatar>
                        </motion.div>
                    )}

                    {service_name && (
                        <p className="text-center text-indigo-100 text-sm uppercase tracking-wider mt-6 mb-2">
                            {service_name}
                        </p>
                    )}

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-3xl font-bold text-center max-w-lg mx-auto leading-relaxed"
                    >
                        {feedback_question || t("feedback.default_question")}
                    </motion.h2>
                </div>

                <div className="p-10 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder={t("invitation.placeholder")}
                            className="min-h-48 text-base rounded-2xl border-gray-200 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white/70 shadow-inner resize-none"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button
                            onClick={() => sendFeedback.mutate()}
                            disabled={sendFeedback.isPending || !feedback.trim()}
                            className="w-full py-6 text-lg font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            {sendFeedback.isPending ? t("action.sending") : t("action.send")}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};