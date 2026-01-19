import { type JSX } from "react";

interface Props {
    label: string;
    value: string | JSX.Element;
    icon?: JSX.Element;
}

export const MessageDetail = ({ label, value, icon }: Props) => (
    <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
            {icon}
            {label}
        </p>
        <p className="font-medium">{value}</p>
    </div>
);