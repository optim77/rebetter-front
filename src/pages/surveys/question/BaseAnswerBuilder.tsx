import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { QuestionHeader } from "@/pages/surveys/preview/QuestionHeader.tsx";
import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type BaseAnswer = {
    setNodeRef: (node: (HTMLElement | null)) => void;
    style: {
        transform: string | undefined,
        transition: string | undefined
    },
    question: Question;
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    removeQuestion: (id: string) => void;
    duplicateQuestion: (id: string) => void;
    saveQuestionTemplate?: (question: Question) => void;
    onLabelChange: (id: string, label: string) => void;
    toggleRequired: (id: string) => void;
    isDate: boolean;
}

export const BaseAnswerBuilder = ({
                                       setNodeRef,
                                       style,
                                       question,
                                       attributes,
                                       listeners,
                                       removeQuestion,
                                       duplicateQuestion,
                                       // saveQuestionTemplate,
                                       onLabelChange,
                                       toggleRequired,
                                      isDate
                                   }: BaseAnswer): JSX.Element => {
    return (
        <Card ref={setNodeRef} style={style} className="mb-4 border shadow-sm">
            <QuestionHeader attributes={attributes} listeners={listeners} question={question}
                            removeQuestion={removeQuestion} duplicateQuestion={duplicateQuestion}/>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm">{t("surveys.field_label")}</Label>
                    <Input
                        placeholder={t("common.content")}
                        value={question.label}
                        type={isDate ? "date" : "text"}
                        onChange={(e) => onLabelChange(question.id, e.target.value)}
                    />
                </div>
                {question.type != "display_info" && (
                    <div className="flex items-center gap-2">
                        <Checkbox checked={question.required} onCheckedChange={() => toggleRequired(question.id)}/>
                        <Label>{t("surveys.required")}</Label>
                    </div>
                )}


            </CardContent>
        </Card>
    )
}