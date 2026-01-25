import { type JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";
import { t } from "i18next";

interface Props {
    currentQuestion: Question
}

export const MultipleAnswerChoices = ({currentQuestion}: Props):JSX.Element => {
    return (
        <div className="space-y-4">
            {currentQuestion.options?.map((opt, i) => {
                const id = `multiple-${currentQuestion.id}-${i}`;
                return (
                    <div key={id} className="flex items-center gap-3">
                        <Checkbox/>
                        <Label htmlFor={id}>
                            {opt || t("surveys.option_placeholder")}
                        </Label>
                    </div>
                );
            })}
        </div>
    )
}