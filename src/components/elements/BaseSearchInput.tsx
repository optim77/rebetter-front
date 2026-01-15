import { type ChangeEvent, type JSX } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { t } from "i18next";

interface Props {
    search: string;
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const BaseSearchInput = ({search, handleSearchChange}: Props):JSX.Element => {
    return (
        <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <Input
                placeholder={t("action.search")}
                value={search}
                onChange={handleSearchChange}
                className="h-10 pl-9"
            />
        </div>
    )
}