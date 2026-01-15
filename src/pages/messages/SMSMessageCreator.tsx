import { type ChangeEvent, type JSX } from "react";
import { Label } from "@/components/ui/label.tsx";
import { MessageSquareText } from "lucide-react";
import { t } from "i18next";
import { TooltipHelper } from "@/components/elements/TooltipHelper.tsx";

interface Props {
    message: string
    handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const SMSMessageCreator = ({message, handleChange}: Props):JSX.Element => {
    return  (
        <>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquareText className="w-5 h-5 text-indigo-600"/>
                        {t("sms.message")}
                    </Label>
                    <TooltipHelper content={t("messages.message")}/>
                </div>
                <textarea
                    name="message"
                    value={message}
                    onChange={handleChange}
                    placeholder={t("sms.enter_message")}
                    className="w-full h-40 px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-300 bg-white/70 shadow-inner resize-none"
                    required
                />
                <p className="text-sm text-gray-500 text-right">{message.length}/160 {t("common.characters")}</p>
            </div>
        </>
    )
}