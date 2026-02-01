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

export const BaseLogicRuleEditor = ({
                                    rule,
                                    questions,
                                    onChange,
                                    onRemove,
                                    question
                                }: Props) => {

    const condition = rule.if[0];
    const operator = condition?.operator;
    const showValueInput = operator && operator !== "has_any_value";
    return (
        <div className="border rounded-lg p-4 space-y-4 bg-background">
            <Label>{t("surveys.if_question")}</Label>

            <Select
                value={operator}
                onValueChange={(value) =>
                    onChange({
                        ...rule,
                        if: [
                            {
                                sourceQuestionId: condition?.sourceQuestionId ?? question.id,
                                operator: value as LogicOperator,
                                value:
                                    value === "has_any_value"
                                        ? undefined
                                        : condition?.value ?? "",
                            },
                        ],
                    })
                }
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("surveys.condition")}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="has_any_value">
                        {t("surveys.has_any_value")}
                    </SelectItem>
                    <SelectItem value="inclueds">
                        {t("surveys.includes")}
                    </SelectItem>
                    <SelectItem value="is">
                        {t("surveys.is")}
                    </SelectItem>
                    <SelectItem value="is_not">
                        {t("surveys.is_not")}
                    </SelectItem>
                </SelectContent>
            </Select>

            {showValueInput && (
                <>
                    <Label>{t("surveys.value")}</Label>
                    <Input
                        value={condition?.value ?? ""}
                        placeholder={t("surveys.value")}
                        onChange={(e) =>
                            onChange({
                                ...rule,
                                if: [
                                    {
                                        ...condition!,
                                        value: e.target.value,
                                    },
                                ],
                            })
                        }
                    />
                </>
            )}

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

            <Button variant="destructive" size="sm" onClick={onRemove}>
                {t("action.delete")}
            </Button>
        </div>
    );
};
