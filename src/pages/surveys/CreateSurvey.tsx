import { useState } from "react";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Plus, Trash, GripVertical } from "lucide-react";
import { t } from "i18next";

type QuestionType = "text" | "choice" | "rating";

interface Question {
    id: string;
    type: QuestionType;
    label: string;
    options?: string[];
}

//
// Sortable Item
//
const SortableQuestion = ({
                              question,
                              onLabelChange,
                              onOptionChange,
                              addOption,
                              removeQuestion
                          }: {
    question: Question;
    onLabelChange: (id: string, label: string) => void;
    onOptionChange: (qid: string, index: number, value: string) => void;
    addOption: (qid: string) => void;
    removeQuestion: (id: string) => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="mb-4 border shadow-sm"
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" {...attributes} {...listeners} />
                    <span className="text-sm font-semibold capitalize">
                        {question.type}
                    </span>
                </div>

                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeQuestion(question.id)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <Label className="text-sm">{t("surveys.field_label")}</Label>
                <Input
                    className="mt-1 mb-3"
                    placeholder={t("common.content")}
                    value={question.label}
                    onChange={(e) => onLabelChange(question.id, e.target.value)}
                />

                {question.type === "choice" && (
                    <div>
                        <Label>{t("surveys.options")}</Label>
                        <div className="mt-2 space-y-2">
                            {question.options?.map((opt, i) => (
                                <Input
                                    key={i}
                                    value={opt}
                                    onChange={(e) => onOptionChange(question.id, i, e.target.value)}
                                    placeholder={`Option ${i + 1}`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-2"
                            onClick={() => addOption(question.id)}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add option
                        </Button>
                    </div>
                )}

                {question.type === "rating" && (
                    <div>
                        <Label className="mb-2 block">{t("surveys.rating")}</Label>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5].map(n => (
                                <div
                                    key={n}
                                    className="px-3 py-1 border rounded bg-gray-100"
                                >
                                    {n}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

//
// PAGE
//
export const CreateSurvey = (): JSX.Element => {
    const { t } = useTranslation();
    const [questions, setQuestions] = useState<Question[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const addQuestion = (type: QuestionType) => {
        setQuestions([
            ...questions,
            {
                id: crypto.randomUUID(),
                type,
                label: "",
                options: type === "choice" ? [""] : undefined
            }
        ]);
    };

    const onLabelChange = (id: string, label: string) => {
        setQuestions(q => q.map(item => item.id === id ? { ...item, label } : item));
    };

    const onOptionChange = (qid: string, index: number, value: string) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid && item.options
                    ? {
                        ...item,
                        options: item.options.map((opt, i) =>
                            i === index ? value : opt
                        )
                    }
                    : item
            )
        );
    };

    const addOption = (qid: string) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid && item.options
                    ? { ...item, options: [...item.options, ""] }
                    : item
            )
        );
    };

    const removeQuestion = (id: string) => {
        setQuestions(q => q.filter(item => item.id !== id));
    };

    const onDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = questions.findIndex(q => q.id === active.id);
        const newIndex = questions.findIndex(q => q.id === over.id);

        const arrayMove = (arr: any[], from: number, to: number) => {
            const newArr = [...arr];
            const item = newArr.splice(from, 1)[0];
            newArr.splice(to, 0, item);
            return newArr;
        };

        setQuestions(prev => arrayMove(prev, oldIndex, newIndex));
    };

    const saveSurvey = () => {
        console.log("Survey saved:", questions);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">{t("surveys.create_new_survey")}</h1>

            <div className="flex gap-3 mb-6">
                <Button onClick={() => addQuestion("text")}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("surveys.text_field")}
                </Button>

                <Button onClick={() => addQuestion("choice")}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("surveys.select_field")}
                </Button>

                <Button onClick={() => addQuestion("rating")}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("surveys.rating")}
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                    {questions.map(q => (
                        <SortableQuestion
                            key={q.id}
                            question={q}
                            onLabelChange={onLabelChange}
                            onOptionChange={onOptionChange}
                            addOption={addOption}
                            removeQuestion={removeQuestion}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <Button className="mt-6" onClick={saveSurvey}>
                {t("surveys.save_survey")}
            </Button>
        </div>
    );
};
