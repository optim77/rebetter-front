import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { QuestionHeader } from "@/pages/surveys/preview/QuestionHeader.tsx";
import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import type { LogicRule, Question } from "@/pages/surveys/CreateSurvey.tsx";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { BaseLogicRuleEditor } from "@/pages/surveys/logic/BaseLogicRuleEditor.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";

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
    questions: Question[];
    addLogicRule?: (questionId: string) => void;
    updateLogicRule?: (questionId: string, ruleIndex: number, rule: LogicRule) => void;
    removeLogicRule?: (questionId: string, ruleIndex: number) => void;
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
                                      isDate,
                                      questions,
                                      addLogicRule,
                                      updateLogicRule,
                                      removeLogicRule,
                                  }: BaseAnswer): JSX.Element => {
    const isLogicDisabled = questions.length < 3;

    return (
        <Card ref={setNodeRef} style={style} className="mb-4 border shadow-sm">
            <QuestionHeader attributes={attributes} listeners={listeners} question={question}
                            removeQuestion={removeQuestion} duplicateQuestion={duplicateQuestion}/>

            <Tabs defaultValue="edit" className="w-full">

                <TabsList className="w-full justify-start rounded-none bg-transparent px-6">
                    <TabsTrigger value="edit" className="cursor-pointer shadow-sm mr-2">
                        {t("surveys.edit")}
                    </TabsTrigger>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <TabsTrigger  disabled={isLogicDisabled} value="logic" className="cursor-pointer shadow-sm w-30">
                                        {t("surveys.logic")}
                                    </TabsTrigger>
                                </span>
                            </TooltipTrigger>
                            {isLogicDisabled && (
                                <TooltipContent>
                                    {t("surveys.add_options_for_logic")}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </TabsList>

                <TabsContent value="edit" className="pt-4">
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
                                <Checkbox checked={question.required}
                                          onCheckedChange={() => toggleRequired(question.id)}/>
                                <Label>{t("surveys.required")}</Label>
                            </div>
                        )}
                    </CardContent>
                </TabsContent>

                <TabsContent value="logic" className="p-6 pt-4">
                    <CardContent className="space-y-6 p-0">
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">{t("surveys.logic_rules")}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t("surveys.logic_description")}
                            </p>


                            {question.logic?.length ? (
                                question.logic.map((rule, index) => (
                                    <BaseLogicRuleEditor
                                        key={index}
                                        rule={rule}
                                        question={question}
                                        questions={questions}
                                        onChange={(updatedRule) =>
                                            updateLogicRule ? updateLogicRule(question.id, index, updatedRule) : null
                                        }
                                        onRemove={() =>
                                            removeLogicRule ? removeLogicRule(question.id, index) : null
                                        }
                                    />
                                ))
                            ) : (
                                <p className="text-center text-sm text-muted-foreground py-6">
                                    {t("surveys.no_logic_rules_yet")}
                                </p>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addLogicRule ? addLogicRule(question.id) : null}
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                {t("surveys.add_logic_rule")}
                            </Button>
                        </div>
                    </CardContent>
                </TabsContent>
            </Tabs>


        </Card>
    )
}