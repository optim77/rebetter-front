import { type JSX } from "react";
import { motion } from "framer-motion";

export const PostFeedbackView = (): JSX.Element => {
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
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/60 text-center"
            >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16 px-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7, ease: "backOut" }}
                        className="mx-auto w-48 h-48 relative"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png"
                            alt="Dziękujemy!"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-4xl font-extrabold text-white mt-10 leading-tight"
                    >
                        Dziękujemy za Twoją opinię! 🙌
                    </motion.h2>
                </div>

                <div className="p-10 space-y-6">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto"
                    >
                        Poświęcenie chwili na feedback naprawdę ma znaczenie. <br />
                        Dzięki takim odpowiedziom możemy się rozwijać{" "}
                        <span className="font-bold text-indigo-600">i robić rzeczy lepiej</span> 🚀
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.7 }}
                        className="text-base text-gray-600"
                    >
                        Twoja opinia została zapisana i już pracuje na lepsze jutro ✨
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="pt-6"
                    >
                        <div className="flex justify-center gap-3 text-3xl">
                            <span className="animate-[bounce_2s_infinite_0.2s]">💜</span>
                            <span className="animate-[bounce_2s_infinite_0.4s]">⭐</span>
                            <span className="animate-[bounce_2s_infinite_0.6s]">🎉</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};