import { type JSX } from "react";

export const NPSQuestion = ():JSX.Element => {
    return (
        <div className="flex flex-wrap gap-3">
            {Array.from({length: 10}, (_, i) => {
                const value = i + 1;

                return (
                    <div
                        key={value}
                        className="h-12 w-12 flex items-center justify-center rounded-lg border border-muted-foreground
                        text-xl font-medium hover:scale-110 hover:-translate-y-1 hover:border-primary hover:shadow-md
                                                        active:scale-95 cursor-pointer"
                    >
                        {value}
                    </div>
                );
            })}

        </div>
    )
}