import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash, GripVertical, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { t } from "i18next";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { SurveysAPI } from "@/api/SurveysAPI.ts";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MultipleAnswerChoices } from "@/pages/surveys/preview/MultipleAnswerChoice.tsx";
import { SingleAnswerChoice } from "@/pages/surveys/preview/SingleAnswerChoice.tsx";
import { RatingQuestion } from "@/pages/surveys/preview/RatingQuestion.tsx";
import { SurveyProgressBar } from "@/pages/surveys/preview/SurveyProgressBar.tsx";
import { TextQuestion } from "@/pages/surveys/preview/TextQuestion.tsx";
import { SmileScaleQuestion } from "@/pages/surveys/preview/SmileScaleQuestion.tsx";
import { DropdownListChoice } from "@/pages/surveys/preview/DropdownListChoice.tsx";

/**
 * TODO LIST:
 *  - randomize options
 *  */


type QuestionType = "text" | "single_answer_choice" | "multiple_answer_choice" | "rating" | "smile_scale" | "nps" | "dropdown_list" | "matrix" | "contact_form" | "rating_answers" | "date" | "display_info";

const QuestionType: string[] = [
    "text",
    "single_answer_choice",
    "multiple_answer_choice",
    "rating",
    "smile_scale",
    "nps",
    "dropdown_list",
    "matrix",
    "contact_form",
    "rating_answers",
    "date",
    "display_info",
]

interface ContactField {
    id: string;
    label: string;
    type: "text" | "email" | "phone" | "textarea";
    required?: boolean;
}

type RatingAnswersResponse = {
    orderedOptionIds: string[];
};

export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    required: boolean;
    options?: string[];
    scale?: number;
    minDate?: string;
    maxDate?: string;
    rows?: string[];
    columns?: string[];
    infoText?: string;
    contactFields?: ContactField[];
}

const SortableQuestion = ({
                              question,
                              onLabelChange,
                              onOptionChange,
                              addOption,
                              removeQuestion,
                              toggleRequired,
                              updateQuestion,
                              updateMatrixRow,
                              updateMatrixColumn,
                              addContactField,
                              updateContactFieldLabel,
                              updateContactFieldType,
                              removeContactField
                          }: {
    question: Question;
    onLabelChange: (id: string, label: string) => void;
    onOptionChange: (qid: string, index: number, value: string) => void;
    addOption: (qid: string) => void;
    removeQuestion: (id: string) => void;
    toggleRequired: (id: string) => void;
    updateQuestion: (q: string, target: string, values: string | number) => void;
    updateMatrixRow: (questionId: string, index: number, value: string) => void;
    updateMatrixColumn: (questionId: string, index: number, value: string) => void;
    addContactField: (questionId: string) => void;
    updateContactFieldLabel: (questionId: string, fieldId: string, value: string) => void;
    updateContactFieldType: (questionId: string, fieldId: string, type: ContactField["type"]) => void;
    removeContactField: (questionId: string, fieldId: string) => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card ref={setNodeRef} style={style} className="mb-4 border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" {...attributes} {...listeners} />
                    <span className="text-sm font-semibold">{t(`surveys.${question.type}`)}</span>
                </div>

                <Button variant="destructive" size="icon" onClick={() => removeQuestion(question.id)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </CardHeader>

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
                    <Checkbox checked={question.required} onCheckedChange={() => toggleRequired(question.id)} />
                    <Label>{t("surveys.required")}</Label>
                </div>

                {["single_answer_choice", "multiple_answer_choice", "dropdown_list"].includes(question.type) && (
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
                            <Plus className="h-4 w-4 mr-1" /> {t("surveys.add_option")}
                        </Button>
                    </div>
                )}

                {["rating", "nps"].includes(question.type) && (
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
                )}
                {question.type === "matrix" && (
                    <div className="space-y-4">
                        <Label>{t("surveys.rows")}</Label>

                        {question.rows?.map((r, i) => (
                            <Input
                                type="number"
                                key={`row-${i}`}
                                value={r}
                                placeholder={`${t("surveys.row")} ${i + 1}`}
                                onChange={(e) =>
                                    updateMatrixRow(question.id, i, e.target.value)
                                }
                            />
                        ))}

                        <Label>{t("surveys.columns")}</Label>

                        {question.columns?.map((c, i) => (
                            <Input
                                type="number"
                                key={`col-${i}`}
                                value={c}
                                placeholder={`${t("surveys.column")} ${i + 1}`}
                                onChange={(e) =>
                                    updateMatrixColumn(question.id, i, e.target.value)
                                }
                            />
                        ))}
                    </div>
                )}

                {question.type === "contact_form" && (
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
                                    onValueChange={(v) =>
                                        updateContactFieldType(question.id, field.id, v as any)
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
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
                            <Plus className="h-4 w-4 mr-1" />
                            {t("surveys.add_field")}
                        </Button>
                    </div>
                )}

                {question.type == "rating_answers" && (
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
                )}

                {question.type == "date" && (
                    <></>
                )}

                {question.type === "display_info" && (
                    <Textarea
                        placeholder={t("surveys.info_text")}
                        value={question.infoText}
                        onChange={(e) =>
                            setQuestions(q =>
                                q.map(item =>
                                    item.id === question.id
                                        ? {...item, infoText: e.target.value}
                                        : item
                                )
                            )
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
};

export const CreateSurvey = (): JSX.Element => {
    const { t } = useTranslation();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { companyId } = useParams<{ companyId: string }>();
    const navigate = useNavigate();

    const [slideOrientation, setSlideOrientation] = useState<"vertical" | "horizontal">("vertical");
    const [allowBack, setAllowBack] = useState(true);
    const [allowEditAnswers, setAllowEditAnswers] = useState(true);
    const [showProgress, setShowProgress] = useState(true);

    const [previewIndex, setPreviewIndex] = useState(0);

    const sensors = useSensors(useSensor(PointerSensor));

    const addQuestion = (type: QuestionType) => {
        const base: Question = {
            id: crypto.randomUUID(),
            type,
            label: "",
            required: false,
        };

        const withDefaults: Record<QuestionType, Partial<Question>> = {
            text: {},
            single_answer_choice: { options: [""] },
            multiple_answer_choice: { options: [""] },
            dropdown_list: { options: [""] },

            rating: { scale: 5 },
            rating_answers: { scale: 5 },
            smile_scale: { scale: 5 },
            nps: { scale: 10 },

            matrix: { rows: [""], columns: [""] },

            contact_form: {
                contactFields: [
                    {
                        id: crypto.randomUUID(),
                        label: t("surveys.open_question"),
                        type: "text",
                    },
                    {
                        id: crypto.randomUUID(),
                        label: t("surveys.email"),
                        type: "email",
                    },
                ],
            },
            date: {},
            display_info: { infoText: "" },
        };

        setQuestions(q => [...q, { ...base, ...withDefaults[type] }]);
        setPreviewIndex(questions.length);
    };

    const onLabelChange = (id: string, label: string) => {
        setQuestions((q) => q.map((item) => (item.id === id ? { ...item, label } : item)));
    };

    const toggleRequired = (id: string) => {
        setQuestions((q) =>
            q.map((item) => (item.id === id ? { ...item, required: !item.required } : item))
        );
    };

    const updateMatrixRow = (questionId: string, index: number, value: string) => {
        setQuestions(q =>
            q.map(item =>
                item.id === questionId && item.rows
                    ? {
                        ...item,
                        rows: item.rows.map((r, i) => (i === index ? value : r)),
                    }
                    : item
            )
        );
    };

    const updateMatrixColumn = (questionId: string, index: number, value: string) => {
        setQuestions(q =>
            q.map(item =>
                item.id === questionId && item.columns
                    ? {
                        ...item,
                        columns: item.columns.map((c, i) => (i === index ? value : c)),
                    }
                    : item
            )
        );
    };

    const addContactField = (questionId: string) => {
        setQuestions(q =>
            q.map(item =>
                item.id === questionId
                    ? {
                        ...item,
                        contactFields: [
                            ...(item.contactFields ?? []),
                            {
                                id: crypto.randomUUID(),
                                label: "",
                                type: "text",
                            },
                        ],
                    }
                    : item
            )
        );
    };

    const updateContactFieldLabel = (
        questionId: string,
        fieldId: string,
        value: string
    ) => {
        setQuestions(q =>
            q.map(item =>
                item.id === questionId
                    ? {
                        ...item,
                        contactFields: item.contactFields?.map(f =>
                            f.id === fieldId ? { ...f, label: value } : f
                        ),
                    }
                    : item
            )
        );
    };

    const updateContactFieldType = (
        questionId: string,
        fieldId: string,
        type: ContactField["type"]
    ) => {
        setQuestions(q =>
            q.map(item =>
                item.id === questionId
                    ? {
                        ...item,
                        contactFields: item.contactFields?.map(f =>
                            f.id === fieldId ? { ...f, type } : f
                        ),
                    }
                    : item
            )
        );
    };

    const removeContactField = (questionId: string, fieldId: string) => {
        setQuestions(q =>
            q.map(item =>
                item.id === questionId
                    ? {
                        ...item,
                        contactFields: item.contactFields?.filter(f => f.id !== fieldId),
                    }
                    : item
            )
        );
    };

    const updateQuestion = <K extends keyof Question>(
        id: string,
        key: K,
        value: Question[K]
    ) => {
        setQuestions(q =>
            q.map(item =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );
    };
    const onOptionChange = (qid: string, index: number, value: string) => {
        setQuestions((q) =>
            q.map((item) =>
                item.id === qid && item.options
                    ? {
                        ...item,
                        options: item.options.map((opt, i) => (i === index ? value : opt)),
                    }
                    : item
            )
        );
    };

    const addOption = (qid: string) => {
        setQuestions((q) =>
            q.map((item) =>
                item.id === qid && item.options
                    ? { ...item, options: [...item.options, ""] }
                    : item
            )
        );
    };

    const removeQuestion = (id: string) => {
        setQuestions((q) => q.filter((item) => item.id !== id));
        if (previewIndex >= questions.length - 1) {
            setPreviewIndex(Math.max(0, previewIndex - 1));
        }
    };

    const onDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = questions.findIndex((q) => q.id === active.id);
        const newIndex = questions.findIndex((q) => q.id === over.id);

        const arrayMove = (arr: any[], from: number, to: number) => {
            const newArr = [...arr];
            const item = newArr.splice(from, 1)[0];
            newArr.splice(to, 0, item);
            return newArr;
        };

        setQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
    };

    const saveSurvey = () => {
        if (!name.trim()) {
            toast.error(t("surveys.survey_name_is_required"));
            return;
        }

        const payload = {
            name,
            description,
            content: questions,
            slideOrientation,
            allowBack,
            allowEditAnswers,
            showProgress,
        };

        createSurveyMutation.mutate(payload);
    };

    const createSurveyMutation = useMutation({
        mutationFn: (payload: any) => SurveysAPI.createSurvey(companyId!, payload),
        onSuccess: (data) => {
            toast.success(t("surveys.created_survey"));
            navigate(`/dashboard/group/${companyId}/survey/${data.id}`);
        },
        onError: (error) => {
            console.error("Error during saving form:", error);
            toast.error(t("errors.save_failed"));
        },
    });

    const currentQuestion = questions[previewIndex];

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white overflow-y-auto p-6 lg:p-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">{name || t("surveys.preview_title")}</h2>
                        {description && <p className="text-muted-foreground">{description}</p>}
                    </div>

                    {questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground">
                            <FileText className="h-16 w-16 mb-6 opacity-40" />
                            <h3 className="text-xl font-medium">{t("surveys.no_questions_preview")}</h3>
                            <p className="mt-2 max-w-md">
                                {t("surveys.add_first_question")}
                            </p>
                        </div>
                    ) : (
                        <Card className="shadow-lg border-0">
                            <CardContent className="p-8 lg:p-12 space-y-8">
                                {showProgress && <SurveyProgressBar previewIndex={previewIndex} questions={questions} />}

                                {currentQuestion && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-medium">
                                            {currentQuestion.label || t("surveys.enter_question_here")}
                                            {currentQuestion.required && <span className="text-destructive ml-1">*</span>}
                                        </h3>

                                        {currentQuestion.type === "text" && (
                                            <TextQuestion />
                                        )}

                                        {currentQuestion.type === "rating" && (
                                            <RatingQuestion currentQuestion={currentQuestion} />
                                        )}
                                        {currentQuestion.type === "single_answer_choice" &&
                                            <SingleAnswerChoice currentQuestion={currentQuestion} />
                                        }

                                        {currentQuestion.type === "multiple_answer_choice" &&
                                            <MultipleAnswerChoices currentQuestion={currentQuestion} />
                                        }

                                        {currentQuestion.type === "smile_scale" && (
                                            <SmileScaleQuestion />
                                        )}

                                        {currentQuestion.type === "nps" && (
                                            <div className="flex flex-wrap gap-3">
                                                {Array.from({ length: 10 }, (_, i) => {
                                                    const value = i + 1;

                                                    return (
                                                        <div
                                                            key={value}
                                                            className="h-12 w-12 flex items-center justify-center rounded-lg border border-muted-foreground text-xl font-medium"
                                                        >
                                                            {value}
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        )}

                                        {currentQuestion.type === "dropdown_list" && (
                                            <DropdownListChoice currentQuestion={currentQuestion} />
                                        )}


                                        {currentQuestion.type === "contact_form" && (
                                            <div className="space-y-4">
                                                {currentQuestion.contactFields?.map(field => {
                                                    if (field.type === "textarea") {
                                                        return (
                                                            <>
                                                                <Label htmlFor={field.id}>{field.label}</Label>
                                                                <Textarea
                                                                    id={field.id}
                                                                    key={field.id}
                                                                />
                                                            </>

                                                        );
                                                    }

                                                    return (
                                                        <>
                                                            <Label htmlFor={field.id}>{field.label}</Label>
                                                            <Input
                                                                key={field.id}
                                                                type={field.type}
                                                            />
                                                        </>

                                                    );
                                                })}
                                            </div>
                                        )}

                                    </div>
                                )}

                                {questions.length > 0 && (
                                    <div className="flex items-center justify-between pt-8 border-t">
                                        <Button
                                            variant="outline"
                                            disabled={previewIndex === 0 || !allowBack}
                                            onClick={() => setPreviewIndex((prev) => prev - 1)}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2"/>
                                            {t("action.back")}
                                        </Button>

                                        <Button
                                            variant="default"
                                            disabled={previewIndex === questions.length - 1}
                                            onClick={() => setPreviewIndex((prev) => prev + 1)}
                                        >
                                            {previewIndex === questions.length - 1 ? t("action.submit") : t("action.next")}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Prawa strona – edycja pytań i ustawienia */}
            <div className="w-full lg:w-96 bg-muted/40 border-l overflow-y-auto p-6 space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="name">{t("surveys.survey_title")}</Label>
                        <Input
                            id="name"
                            placeholder={t("surveys.survey_title")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Label htmlFor="description">{t("surveys.survey_description")}</Label>
                        <Textarea
                            id="description"
                            placeholder={t("surveys.survey_description")}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Ustawienia prezentacji */}
                    <Card>
                        <CardHeader className="pb-3">
                            <h2 className="text-lg font-medium">{t("surveys.presentation_settings")}</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>{t("surveys.slide_orientation")}</Label>
                                <Select value={slideOrientation} onValueChange={(v: "vertical" | "horizontal") => setSlideOrientation(v)}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vertical">{t("surveys.vertical")}</SelectItem>
                                        <SelectItem value="horizontal">{t("surveys.horizontal")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>{t("surveys.allow_back")}</Label>
                                <Switch checked={allowBack} onCheckedChange={setAllowBack} />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>{t("surveys.allow_edit_answers")}</Label>
                                <Switch checked={allowEditAnswers} onCheckedChange={setAllowEditAnswers} />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>{t("surveys.show_progress")}</Label>
                                <Switch checked={showProgress} onCheckedChange={setShowProgress} />
                            </div>
                        </CardContent>
                    </Card>

                    <Select onValueChange={(value) => addQuestion(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("surveys.add_question")} />
                        </SelectTrigger>
                        <SelectContent>
                            {QuestionType.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {t(`surveys.${type}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {questions.length > 0 && (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                            <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                                {questions.map((q) => (
                                    <SortableQuestion
                                        key={q.id}
                                        question={q}
                                        onLabelChange={onLabelChange}
                                        onOptionChange={onOptionChange}
                                        addOption={addOption}
                                        removeQuestion={removeQuestion}
                                        toggleRequired={toggleRequired}
                                        updateQuestion={updateQuestion}
                                        updateMatrixRow={updateMatrixRow}
                                        updateMatrixColumn={updateMatrixColumn}
                                        addContactField={addContactField}
                                        updateContactFieldLabel={updateContactFieldLabel}
                                        updateContactFieldType={updateContactFieldType}
                                        removeContactField={removeContactField}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <div>
                    <Button
                        onClick={saveSurvey}
                        disabled={createSurveyMutation.isPending || !name.trim()}
                        className="w-full"
                        size="lg"
                    >
                        {createSurveyMutation.isPending ? t("action.saving") : t("surveys.save_survey")}
                    </Button>
                </div>
            </div>
        </div>
    );
};