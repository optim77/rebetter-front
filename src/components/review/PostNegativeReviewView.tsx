import { type JSX } from "react";
// TODO: Translate
export const PostNegativeReviewView = (): JSX.Element => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#fdfbfb] to-[#ebedee]">

            {/* ilustracja w stylu nowoczesnej flat-3D */}
            <div className="relative mb-8">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-red-300 to-red-500 blur-3xl opacity-30 absolute -top-10 -left-10 animate-pulse" />
                <img
                    src="https://cdn-icons-png.flaticon.com/512/8978/8978855.png"
                    alt="Sad emoji"
                    className="relative w-40 mx-auto drop-shadow-xl animate-[float_4s_ease-in-out_infinite]"
                />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
                Oho... coś poszło nie tak 😅
            </h2>

            <p className="max-w-sm text-gray-600 leading-relaxed">
                Rozumiemy! Nawet najlepszym zdarzają się potknięcia. <br />
                Twoja opinia naprawdę nam pomaga —
                <span className="font-semibold"> jak witaminy, ale dla firmy</span> 💊💼.
            </p>

            <p className="text-sm text-gray-500 mt-3">
                Obiecujemy, że niczego nie wzięliśmy do siebie… <br />
                <span className="italic">no dobra, może troszeczkę.</span> 🥲
            </p>



        </div>
    );
};
