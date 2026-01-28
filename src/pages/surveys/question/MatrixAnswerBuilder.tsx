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
    updateMatrixSize: (questionId: string, size: number) => void;
    updateMatrixRow: (questionId: string, index: number, value: string) => void;
    updateMatrixColumn: (questionId: string, index: number, value: string) => void;
}

export const MatrixAnswerBuilder = ({
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
                                      updateMatrixSize,
                                      updateMatrixRow,
                                      updateMatrixColumn
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
                        type={"text"}
                        onChange={(e) => onLabelChange(question.id, e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox checked={question.required} onCheckedChange={() => toggleRequired(question.id)}/>
                    <Label>{t("surveys.required")}</Label>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>{t("surveys.matrix_size")}</Label>
                        <Input
                            type="number"
                            min={1}
                            max={10}
                            value={question.rows?.length ?? 1}
                            onChange={(e) =>
                                updateMatrixSize(
                                    question.id,
                                    Math.max(1, Number(e.target.value))
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            {t("surveys.matrix_size_hint")}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>{t("surveys.rows")}</Label>
                        {question.rows?.map((row, i) => (
                            <Input
                                key={`row-${i}`}
                                value={row}
                                placeholder={`${t("surveys.row")} ${i + 1}`}
                                onChange={(e) =>
                                    updateMatrixRow(question.id, i, e.target.value)
                                }
                            />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label>{t("surveys.columns")}</Label>
                        {question.columns?.map((col, i) => (
                            <Input
                                key={`col-${i}`}
                                value={col}
                                placeholder={`${t("surveys.column")} ${i + 1}`}
                                onChange={(e) =>
                                    updateMatrixColumn(question.id, i, e.target.value)
                                }
                            />
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}