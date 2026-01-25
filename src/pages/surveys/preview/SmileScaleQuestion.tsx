import { type JSX } from "react";

export const SmileScaleQuestion = ():JSX.Element => {
    return (
        <div className="flex justify-center gap-4">
            {["😡", "🙁", "😐", "🙂", "😄"].map((emoji, i) => (
                <div
                    key={i}
                    className="h-14 w-14 flex items-center justify-center
                                                        rounded-full border border-muted-foreground
                                                        text-3xl cursor-pointer transition-all duration-200 ease-out
                                                        hover:scale-110 hover:-translate-y-1 hover:border-primary hover:shadow-md
                                                        active:scale-95"
                >
                    {emoji}
                </div>
            ))}
        </div>
    )
}