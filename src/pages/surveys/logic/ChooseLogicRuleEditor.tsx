import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { LogicOperator, LogicRule, Question } from "@/pages/surveys/CreateSurvey.tsx";
import {
    MultiSelect,
    MultiSelectContent, MultiSelectGroup, MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue
} from "@/components/ui/multi-select.tsx";

type Props = {
    rule: LogicRule;
    questions: Question[];
    onChange: (rule: LogicRule) => void;
    onRemove: () => void;
    question: Question;
};

export const ChooseLogicRuleEditor = ({
                                          rule,
                                          questions,
                                          onChange,
                                          onRemove,
                                          question
                                      }: Props) => {

    const condition = rule.if[0];
    const operator = condition?.operator;
    return (
        <div className="border rounded-lg p-4 space-y-4 bg-background">


            {question.type === "single_answer_choice" || question.type === "dropdown_list" && (
                <>

                    <Select
                        value={operator}
                        onValueChange={(value) =>
                            onChange({
                                ...rule,
                                if: [
                                    {
                                        sourceQuestionId: condition?.sourceQuestionId ?? question.id,
                                        operator: value as LogicOperator,
                                        value: condition?.value ?? "",
                                    },
                                ],
                            })
                        }
                    >
                        {question.options && question.options.length > 1 ? (
                            <>
                                <Label>{t("surveys.condition_equals")}</Label>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("surveys.answer")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {question.options.map((option, i) => (
                                        <SelectItem value={option.id}>
                                            {option.option ? option.option : t("surveys.option") + " " + (i + 1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </>

                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-6">
                                {t("surveys.add_options_to_select")}
                            </p>
                        )
                        }

                    </Select>
                </>

            )}

            {question.type === "multiple_answer_choice" && question.options && (
                <>
                    <Label>{t("surveys.answer")}</Label>

                    <MultiSelect
                        values={Array.isArray(condition?.value) ? condition.value : []}
                        onValuesChange={(values) =>
                            onChange({
                                ...rule,
                                if: [
                                    {
                                        sourceQuestionId: condition?.sourceQuestionId ?? question.id,
                                        operator: "includes",
                                        value: values,
                                    },
                                ],
                            })
                        }
                    >
                        <MultiSelectTrigger className="w-full">
                            <MultiSelectValue placeholder={t("surveys.select_answers")} />
                        </MultiSelectTrigger>

                        <MultiSelectContent>
                            <MultiSelectGroup>
                                {question.options.map((option, i) => (
                                    <MultiSelectItem key={option.id} value={option.id}>
                                        {option.option ? option.option : t("surveys.option") + " " + (i + 1)}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </>
            )}




            {question.options && question.options.length > 1 && (
                <>
                    <Label>{t("surveys.then")}</Label>

                    <Select
                        value={rule.then.goToQuestionId}
                        onValueChange={(value) =>
                            onChange({
                                ...rule,
                                then: {goToQuestionId: value},
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("surveys.go_to")}/>
                        </SelectTrigger>
                        <SelectContent>
                            {questions.filter((q) => q != question).map((q) => {
                                return (
                                    <SelectItem key={q.id} value={q.id}>{q.label ? q.label : t(`surveys.${q.type}`)}</SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </>
            )}


            <Button variant="destructive" size="sm" onClick={onRemove}>
                {t("action.delete")}
            </Button>
        </div>
    );
};
