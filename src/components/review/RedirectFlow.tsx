import { type JSX, useState } from "react";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { InvitationAPI } from "@/api/InvitationAPI.ts";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface RedirectFlowProps {
    redirectUrl: string;
    companyId: string | undefined;
    clientId: string | undefined;
    trackingId: string | undefined;
}

export const RedirectFlow = ({
                                 redirectUrl,
                                 companyId,
                                 clientId,
                                 trackingId
}: RedirectFlowProps): JSX.Element => {


    const [form, setForm] = useState<{showForm:boolean, feedback: string | null}>({showForm:false, feedback: null});
    const navigate = useNavigate();

    const moveToPortal = () => {
        window.location.href = redirectUrl;
    }

    const positiveFeedback = useMutation({
        mutationFn: async () => {
            if (!companyId || !clientId || !trackingId) throw new Error("Missing required parameters!");
            return InvitationAPI.sendRedirectPositiveResponse(companyId, clientId, trackingId);
        },
        onSuccess: () => {
            moveToPortal();
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t('errors.base_error'));
            console.error("Failed to send ping:", apiError);
        },
    });



    const negativeFeedback = useMutation({
        mutationFn: async () => {
            if (!companyId || !clientId || !trackingId) throw new Error("Missing required parameters!");
            return InvitationAPI.sendRedirectNegativeResponse(companyId, clientId, trackingId, form.feedback);
        },
        onSuccess: () => {
            navigate('/post_negative');
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t('errors.base_error'));
            console.error("Failed to send ping:", apiError);
        },
    })

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
                    className="text-3xl font-semibold text-slate-800 leading-snug"
                >
                    {t("invitation.head_text")}
                </motion.h2>

                {!form?.showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center gap-4 mt-4"
                    >
                        <Button
                            onClick={() => positiveFeedback.mutate()}
                            className="flex-1 h-12 flex items-center justify-center text-white font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.03] hover:shadow-lg transition-all cursor-pointer"
                        >
                            {t("common.yes")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setForm(prevState => ({
                                ...prevState,
                                showForm: true
                            }))}
                            className="flex-1 h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer"
                        >
                            {t("common.no")}
                        </Button>
                    </motion.div>
                )}

                <AnimatePresence>
                    {form.showForm && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="mt-6 text-left"
                        >
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="feedback"
                                        className="text-slate-700 text-sm font-medium"
                                    >
                                        {t("common.feedback")}
                                    </Label>
                                    <Textarea
                                        id="feedback"
                                        onChange={(e) => setForm(prevState => ({
                                            ...prevState,
                                            feedback: e.target.value
                                        }))}
                                        placeholder={t("common.feedback")}
                                        className="min-h-[120px] rounded-2xl border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <Button
                                        type="button"
                                        onClick={() => setForm(prevState => ({
                                            ...prevState,
                                            showForm: false
                                        }))}
                                        className="flex-1 h-11 bg-white border border-emerald-200 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-all"
                                    >
                                        {t("action.back")}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all"
                                        onClick={() => negativeFeedback.mutate()}
                                    >
                                        {t("action.send")}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
