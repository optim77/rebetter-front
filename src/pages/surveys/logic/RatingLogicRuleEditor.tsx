import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { LogicOperator, LogicRule, Question } from "@/pages/surveys/CreateSurvey.tsx";
import { Input } from "@/components/ui/input.tsx";

type Props = {
    rule: LogicRule;
    questions: Question[];
    onChange: (rule: LogicRule) => void;
    onRemove: () => void;
    question: Question;
};

export const RatingLogicRuleEditor = ({
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


            {(question.type === "rating" || question.type === "nps") && (
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
                        <SelectTrigger>
                            <SelectValue placeholder={t("surveys.condition")}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="is">
                                {t("surveys.is")}
                            </SelectItem>
                            <SelectItem value="is_not">
                                {t("surveys.is_not")}
                            </SelectItem>
                            <SelectItem value="greater_than">
                                {t("surveys.greater_than")}
                            </SelectItem>
                            <SelectItem value="lower_than">
                                {t("surveys.lower_than")}
                            </SelectItem>
                        </SelectContent>

                    </Select>
                </>

            )}
            <Input
                type="number"
                min={0}
                max={question.scale}
                value={condition?.value ?? ""}
                onChange={(e) =>
                    onChange({
                        ...rule,
                        if: [
                            {
                                sourceQuestionId: condition?.sourceQuestionId ?? question.id,
                                operator: condition?.operator ?? "is",
                                value: Number(e.target.value),
                            },
                        ],
                    })
                }
            />

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
                            <SelectItem key={q.id}
                                        value={q.id}>{q.label ? q.label : t(`surveys.${q.type}`)}</SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>


            <Button variant="destructive" size="sm" onClick={onRemove}>
                {t("action.delete")}
            </Button>
        </div>
    );
};
