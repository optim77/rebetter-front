import { type JSX } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Info } from "lucide-react";

interface Props {
    content: string
}

export const TooltipHelper = ({content}: Props):JSX.Element => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="w-3"/>
            </TooltipTrigger>
            <TooltipContent>
                {content}
            </TooltipContent>
        </Tooltip>
    )
}