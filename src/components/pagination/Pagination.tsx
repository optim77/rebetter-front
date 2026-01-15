import { t } from "i18next";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type JSX } from "react";

interface Props {
    totalPages: number;
    pageSize: number;
    total: number;
    page: number;
    handlePageChange: (page: number) => void;
}

export const Pagination = ({
                               totalPages,
                               pageSize,
                               total,
                               page,
                               handlePageChange,
                           }: Props): JSX.Element | undefined => {
    if (totalPages > 0) {
        return (
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {t("common.showing")} {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} {t("common.of")} {total}
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1"/>
                        {t("action.previous")}
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({length: Math.min(7, totalPages)}, (_, i) => {
                            let pageNum: number;

                            if (totalPages <= 7) {
                                pageNum = i + 1;
                            } else if (page <= 4) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 3) {
                                pageNum = totalPages - 6 + i;
                            } else {
                                pageNum = page - 3 + i;
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === page ? "default" : "outline"}
                                    size="sm"
                                    className="min-w-[36px] h-8"
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        {t("action.next")}
                        <ChevronRight className="h-4 w-4 ml-1"/>
                    </Button>
                </div>
            </div>
        )
    }


}