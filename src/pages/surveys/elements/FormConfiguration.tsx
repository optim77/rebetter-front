import { type Dispatch, type JSX, type SetStateAction } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { t } from "i18next";

interface Props {
    allowBack: boolean;
    setAllowBack: Dispatch<SetStateAction<boolean>>;
    allowSkip: boolean;
    setAllowSkip: Dispatch<SetStateAction<boolean>>;
    allowEditAnswers: boolean;
    setAllowEditAnswers: Dispatch<SetStateAction<boolean>>;
    showProgress: boolean;
    setShowProgress: Dispatch<SetStateAction<boolean>>;
}

export const FormConfiguration = ({
                                      allowBack,
                                      setAllowBack,
                                      allowSkip,
                                      setAllowSkip,
                                      allowEditAnswers,
                                      setAllowEditAnswers,
                                      showProgress,
                                      setShowProgress
                                  }: Props): JSX.Element => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <h2 className="text-lg font-medium">{t("surveys.presentation_settings")}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>{t("surveys.allow_back")}</Label>
                    <Switch checked={allowBack} onCheckedChange={setAllowBack}/>
                </div>
                <div className="flex items-center justify-between">
                    <Label>{t("surveys.allow_skip")}</Label>
                    <Switch checked={allowSkip} onCheckedChange={setAllowSkip}/>
                </div>

                <div className="flex items-center justify-between">
                    <Label>{t("surveys.allow_edit_answers")}</Label>
                    <Switch checked={allowEditAnswers} onCheckedChange={setAllowEditAnswers}/>
                </div>

                <div className="flex items-center justify-between">
                    <Label>{t("surveys.show_progress")}</Label>
                    <Switch checked={showProgress} onCheckedChange={setShowProgress}/>
                </div>
            </CardContent>
        </Card>
    )
}