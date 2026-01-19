import { type JSX } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";

export const BaseSpinner = ():JSX.Element => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner/>
        </div>
    )
}