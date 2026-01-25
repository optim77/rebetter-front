import { type JSX } from "react";
import { Progress } from "@/components/ui/progress.tsx";
import { t } from "i18next";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";

interface Props {
    previewIndex: number;
    questions: Question[];
}

export const SurveyProgressBar = ({previewIndex, questions}: Props):JSX.Element => {
    return (
        <div className="space-y-2">
            <Progress value={((previewIndex + 1) / questions.length) * 100} className="h-2"/>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("common.page")} {previewIndex + 1}</span>
                <span>{t("common.of")} {questions.length}</span>
            </div>
        </div>
    )
}