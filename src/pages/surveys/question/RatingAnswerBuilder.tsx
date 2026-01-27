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
    updateQuestion: (q: string, target: string, values: string | number) => void;
}

export const RatingAnswerBuilder = ({
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
                                        updateQuestion
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
                        onChange={(e) => onLabelChange(question.id, e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox checked={question.required} onCheckedChange={() => toggleRequired(question.id)}/>
                    <Label>{t("surveys.required")}</Label>
                </div>
                <div className="space-y-2">
                    <Label>{t("surveys.scale")}</Label>
                    <Input
                        type="number"
                        min={2}
                        max={10}
                        value={question.scale ?? 5}
                        onChange={(e) =>
                            updateQuestion(
                                question.id,
                                "scale",
                                Number(e.target.value)
                            )
                        }
                    />
                </div>
            </CardContent>
        </Card>
    )
}