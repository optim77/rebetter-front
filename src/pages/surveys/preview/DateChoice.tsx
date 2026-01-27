import { type JSX } from "react";
import { Input } from "@/components/ui/input.tsx";

export const DateChoice = ():JSX.Element => {
    return (
        <div className="max-w-xs">
            <Input type="date"/>
        </div>
    )
}