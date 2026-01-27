import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { QuestionHeader } from "@/pages/surveys/preview/QuestionHeader.tsx";
import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import type { ContactField, Question } from "@/pages/surveys/CreateSurvey.tsx";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

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
    updateContactFieldLabel: (questionId: string, fieldId: string, value: string) => void;
    updateContactFieldType: (questionId: string, fieldId: string, type: ContactField["type"]) => void;
    removeContactField: (questionId: string, fieldId: string) => void;
    addContactField: (questionId: string) => void;
}

export const ContactAnswerBuilder = ({
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
                                         updateContactFieldLabel,
                                         updateContactFieldType,
                                         removeContactField,
                                         addContactField
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
                <div className="space-y-4">
                    <Label>{t("surveys.contact_fields")}</Label>

                    {question.contactFields?.map((field) => (
                        <div key={field.id} className="flex items-center gap-3">
                            <Input
                                value={field.label}
                                placeholder={t("surveys.field_label")}
                                onChange={(e) =>
                                    updateContactFieldLabel(
                                        question.id,
                                        field.id,
                                        e.target.value
                                    )
                                }
                            />

                            <Select
                                value={field.type}
                                onValueChange={(v: "text" | "email" | "phone" | "textarea") =>
                                    updateContactFieldType(question.id, field.id, v)
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">{t("surveys.text")}</SelectItem>
                                    <SelectItem value="email">{t("surveys.email")}</SelectItem>
                                    <SelectItem value="phone">{t("surveys.phone")}</SelectItem>
                                    <SelectItem value="textarea">{t("surveys.textarea")}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    removeContactField(question.id, field.id)
                                }
                            >
                                ✕
                            </Button>
                        </div>
                    ))}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addContactField(question.id)}
                    >
                        <Plus className="h-4 w-4 mr-1"/>
                        {t("surveys.add_field")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}