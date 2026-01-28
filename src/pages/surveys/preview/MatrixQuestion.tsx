import { type JSX } from "react";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";
import { t } from "i18next";

interface Props {
    currentQuestion: Question;
}

export const MatrixQuestion = ({currentQuestion}: Props):JSX.Element => {
    if (currentQuestion.rows?.length && currentQuestion.columns?.length) {
        return (
            <div className="overflow-x-auto">
                <table className="w-full border border-muted rounded-md border-collapse">
                    <thead>
                    <tr className="bg-muted/50">
                        <th className="p-2 text-left"/>
                        {currentQuestion.columns.map((col, colIndex) => (
                            <th
                                key={colIndex}
                                className="p-2 text-center text-sm font-medium"
                            >
                                {col || t('surveys.column') + " " + colIndex + 1}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {currentQuestion.rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-t hover:bg-muted/30 transition"
                        >
                            <td className="p-2 text-sm font-medium">
                                {row || t('surveys.row') + " " + rowIndex + 1}
                            </td>

                            {currentQuestion.columns && currentQuestion.columns.map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="p-2 text-center"
                                >
                                    <input
                                        type="radio"
                                        name={`matrix-row-${currentQuestion.id}-${rowIndex}`}
                                        disabled
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return (
            <p className="text-sm text-muted-foreground">
                {t("surveys.matrix_not_configured")}
            </p>
        )
    }
}