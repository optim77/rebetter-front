import { type JSX } from "react";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";

interface Props {
    currentQuestion: Question;
}

export const ContactQuestion = ({currentQuestion}: Props):JSX.Element => {
    return (
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
    )
}