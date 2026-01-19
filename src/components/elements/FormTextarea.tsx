import { type ChangeEvent, type JSX } from "react";
import { Label } from "@/components/ui/label.tsx";
import { t } from "i18next";
import { Textarea } from "@/components/ui/textarea.tsx";

interface Props {
    icon: JSX.Element;
    id: string;
    name: string;
    value: string;
    handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    required: boolean;
}

export const FormTextarea = ({icon, id, name, required, value, handleChange, placeholder}: Props):JSX.Element => {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor={id} className="flex items-center gap-2">
                    {icon}
                    {t(`form.${name}`)} {required && (<span className="text-destructive">*</span>)}
                </Label>
                <Textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
        </>
    )
}