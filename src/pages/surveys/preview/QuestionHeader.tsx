import { type JSX } from "react";
import { Copy, Ellipsis, GripVertical, Trash } from "lucide-react";
import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { CardHeader } from "@/components/ui/card.tsx";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";

interface Props {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    question: Question;
    removeQuestion: (id: string) => void;
    duplicateQuestion: (id: string) => void;
    saveQuestionTemplate?: (question: Question) => void;
    createLogicPath?: (path: string) => void;
}

export const QuestionHeader = ({
                                   attributes,
                                   listeners,
                                   question,
                                   removeQuestion,
                                   duplicateQuestion,
                                   // saveQuestionTemplate,
                                   // createLogicPath
                               }: Props): JSX.Element => {
    return (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" {...attributes} {...listeners} />
                <span className="text-sm font-semibold">{t(`surveys.${question.type}`)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={() => removeQuestion(question.id)}>
                    <Trash className="h-2 w-2"/>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Ellipsis className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicateQuestion(question.id)}>
                            <Copy className="mr-2 h-4 w-4"/>
                            {t("action.duplicate")}
                        </DropdownMenuItem>
                        {/*TODO: Implement*/}
                        {/*<DropdownMenuItem onClick={() => saveQuestionTemplate ? saveQuestionTemplate(question) :}>*/}
                        {/*    <Save className="mr-2 h-4 w-4" />*/}
                        {/*    {t("action.save_field")}*/}
                        {/*</DropdownMenuItem>*/}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
    )
}