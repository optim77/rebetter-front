import { type JSX } from "react";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label.tsx";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";
import { t } from "i18next";

interface Props {
    currentQuestion: Question;
}

export const SingleAnswerChoice = ({currentQuestion}:Props):JSX.Element => {
    return (
        <div className="space-y-4">
            <RadioGroup className="space-y-3">
                {currentQuestion.options?.map((opt) => {

                    return (
                        <div key={opt.id} className="flex items-center gap-3">
                            <RadioGroupItem value={opt.id} id={opt.id}/>
                            <Label htmlFor={opt.id}>
                                {opt.option || t("surveys.option_placeholder")}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    )
}