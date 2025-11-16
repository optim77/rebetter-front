import { type JSX } from "react";
import { t } from "i18next";
import { motion } from "framer-motion";

export const FeedbackAlreadyDone = (): JSX.Element => {
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4">

            <motion.div
                className="absolute w-96 h-96 rounded-full bg-rose-200/40 blur-3xl -top-20 -left-20"
                animate={{ x: [0, 20, 0], y: [0, 35, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-[30rem] h-[30rem] rounded-full bg-amber-200/40 blur-3xl -bottom-32 -right-20"
                animate={{ x: [0, -25, 0], y: [0, -40, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-md w-full bg-white/70 shadow-2xl border border-rose-100 backdrop-blur-xl rounded-3xl p-8 text-center"
            >
                <motion.div
                    className="mx-auto mb-6 w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 h-11 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 12V7a4 4 0 10-8 0v5m-2 0h12v8H6v-8z"
                        />
                    </svg>
                </motion.div>

                <h2 className="text-2xl font-semibold text-rose-700 mb-2">
                    {t("feedback.already_done_feedback")}
                </h2>

                <p className="text-slate-600 text-sm">
                    {t("feedback.thank_you_for_your_time")}
                </p>
            </motion.div>
        </div>
    );
};
