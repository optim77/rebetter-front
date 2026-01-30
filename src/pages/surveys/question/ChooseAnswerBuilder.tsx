import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { QuestionHeader } from "@/pages/surveys/preview/QuestionHeader.tsx";
import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
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
    onOptionChange: (qid: string, index: number, value: string) => void;
    addOption: (qid: string) => void;
    toggleShuffle: (id: string) => void;
}

export const ChooseAnswerBuilder = ({
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
                                        onOptionChange,
                                        addOption,
                                        toggleShuffle
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
                <div className="flex items-center gap-2">
                    <Checkbox checked={question.shuffle} onCheckedChange={() => toggleShuffle(question.id)}/>
                    <Label>{t("surveys.shuffle")}</Label>
                </div>
                <div className="space-y-3">
                    <Label>{t("surveys.options")}</Label>
                    {question.options?.map((opt, i) => (
                        <Input
                            key={i}
                            value={opt}
                            onChange={(e) => onOptionChange(question.id, i, e.target.value)}
                            placeholder={`${t("surveys.option")} ${i + 1}`}
                        />
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addOption(question.id)}>
                        <Plus className="h-4 w-4 mr-1"/> {t("surveys.add_option")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}