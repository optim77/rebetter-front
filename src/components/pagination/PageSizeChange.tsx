import { type JSX } from "react";
import { t } from "i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { PAGE_SIZES } from "@/components/pagination/consts.ts";

interface Props {
    pageSize: number;
    handlePageSizeChange: (page: string) => void;
}

export const PageSizeChange = ({pageSize, handlePageSizeChange}: Props):JSX.Element => {
    return (
        <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {t("common.show")}:
                    </span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-[80px] h-9">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {PAGE_SIZES.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}