import { type JSX } from "react";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";

interface Props {
    currentQuestion: Question;
}

export const RatingQuestion = ({currentQuestion}: Props):JSX.Element => {
    return (
        <div className="flex flex-wrap gap-3">
            {Array.from({length: currentQuestion.scale ?? 5}, (_, i) => {
                const value = i + 1;

                return (
                    <div
                        key={value}
                        className="h-12 w-12 flex items-center justify-center rounded-lg border border-muted-foreground text-xl font-medium"
                    >
                        {value}
                    </div>
                );
            })}
        </div>
    )
}