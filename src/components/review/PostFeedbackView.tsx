import { type JSX } from "react";
// TODO: Translate
export const PostFeedbackView = (): JSX.Element => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#fdfefe] to-[#eef2f3]">

            <div className="relative mb-8">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 blur-3xl opacity-30 absolute -top-10 -left-10 animate-pulse" />
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png"
                    alt="Thank you"
                    className="relative w-40 mx-auto drop-shadow-xl animate-[float_4s_ease-in-out_infinite]"
                />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
                Dziękujemy za Twoją opinię! 🙌
            </h2>

            <p className="max-w-sm text-gray-600 leading-relaxed">
                Poświęcenie chwili na feedback naprawdę ma znaczenie. <br />
                Dzięki takim odpowiedziom możemy się rozwijać
                <span className="font-semibold"> i robić rzeczy lepiej</span> 🚀
            </p>

            <p className="text-sm text-gray-500 mt-3">
                Twoja opinia została zapisana i już pracuje na lepsze jutro ✨
            </p>
        </div>
    );
};
