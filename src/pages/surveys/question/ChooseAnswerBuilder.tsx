import { type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { QuestionHeader } from "@/pages/surveys/preview/QuestionHeader.tsx";
import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import type { LogicRule, Question } from "@/pages/surveys/CreateSurvey.tsx";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { ChooseLogicRuleEditor } from "@/pages/surveys/logic/ChooseLogicRuleEditor.tsx";
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
    onOptionChange: (qid: string, optionId: string, value: string) => void;
    addOption: (qid: string) => void;
    toggleShuffle: (id: string) => void;
    questions: Question[];
    addLogicRule: (questionId: string) => void;
    updateLogicRule: (questionId: string, ruleIndex: number, rule: LogicRule) => void;
    removeLogicRule: (questionId: string, ruleIndex: number) => void;
    removeOption: (qid: string, optionId: string) => void;
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
                                        toggleShuffle,
                                        questions,
                                        addLogicRule,
                                        updateLogicRule,
                                        removeLogicRule,
                                        removeOption
                                    }: BaseAnswer): JSX.Element => {
    const isDisabled = !question.options || question.options.length < 2;
    const isDisabledLogic = questions.length < 3;
    return (
        <Card ref={setNodeRef} style={style} className="mb-4 border shadow-sm">
            <QuestionHeader attributes={attributes} listeners={listeners} question={question}
                            removeQuestion={removeQuestion} duplicateQuestion={duplicateQuestion}/>
            <Tabs defaultValue="edit" className="w-full">
                <TabsList className="w-full justify-start rounded-none bg-transparent px-6 ">
                    <TabsTrigger value="edit"
                                 className="cursor-pointer shadow-sm mr-2">
                        {t("surveys.edit")}
                    </TabsTrigger>




                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <TabsTrigger  disabled={isDisabledLogic} value="logic" className="cursor-pointer shadow-sm w-30">
                                        {t("surveys.logic")}
                                    </TabsTrigger>
                                </span>
                            </TooltipTrigger>
                            {isDisabledLogic && (
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
                                <div className="flex gap-2">
                                    <Input
                                        key={i}
                                        value={opt.option}
                                        onChange={(e) => onOptionChange(question.id, opt.id, e.target.value)}
                                        placeholder={`${t("surveys.option")} ${i + 1}`}
                                    />
                                    <Button variant="destructive" onClick={() => removeOption(question.id, opt.id)}>{t("action.delete")}</Button>
                                </div>

                            ))}
                            <Button size="sm" variant="outline" onClick={() => addOption(question.id)}>
                                <Plus className="h-4 w-4 mr-1"/> {t("surveys.add_option")}
                            </Button>
                        </div>
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
                                    <ChooseLogicRuleEditor
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addLogicRule ? addLogicRule(question.id) : null}
                                                disabled={isDisabled}
                                            >
                                            <Plus className="h-4 w-4 mr-2"/>
                                                {t("surveys.add_logic_rule")}
                                        </Button>
                                        </span>

                                    </TooltipTrigger>
                                    {isDisabled && (
                                        <TooltipContent>
                                            {t("surveys.add_options_to_select")}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>

                        </div>
                    </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    )
}