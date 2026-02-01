import { type JSX } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { t } from "i18next";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";

interface Props {
    currentQuestion: Question;
}

export const DropdownListChoice = ({currentQuestion}: Props):JSX.Element => {
    return (
        <div className="max-w-sm">
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("surveys.select_option")}/>
                </SelectTrigger>

                <SelectContent>
                    {currentQuestion.options?.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                            {opt.option || t("surveys.option_placeholder")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}