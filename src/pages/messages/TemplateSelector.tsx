import { type JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TemplateAPI, type TemplateResponse } from "@/api/TemplateAPI.ts";
import { t } from "i18next";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Label } from "@/components/ui/label.tsx";

interface TemplateSelectorProps {
    onTemplateSelect: (templateId: string) => void;
    currentTemplate?: string;
}

export const TemplateSelector = ({
                                     onTemplateSelect,
                                     currentTemplate,
                                 }: TemplateSelectorProps): JSX.Element => {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse["items"][0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {
        data: templatesResponse,
        isLoading: isLoadingTemplates,
        isError: isErrorTemplates,
    } = useQuery({
        queryKey: ["publicTemplates"],
        queryFn: async (): Promise<TemplateResponse> => TemplateAPI.fetchPublicTemplates(),
    });

    const templates = templatesResponse?.items || [];

    if (isErrorTemplates) {
        return <p className="text-red-500 text-sm">{t("errors.data_loading_failed")}</p>;
    }

    if (isLoadingTemplates) {
        return <Spinner />;
    }

    const openPreview = (template: typeof templates[0]) => {
        setSelectedTemplate(template);
        setIsDialogOpen(true);
    };

    const confirmTemplate = () => {
        if (selectedTemplate) {
            onTemplateSelect(selectedTemplate.id);
        }
        setIsDialogOpen(false);
    };

    const clearTemplate = () => {
        onTemplateSelect("");
        setIsDialogOpen(false);
    };

    const currentTemplateObj = templates.find(t => t.id === currentTemplate);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label className="text-lg font-semibold">{t("messages.template")}</Label>

                {currentTemplateObj && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t("messages.current_template")}</p>
                            <p className="text-sm text-amber-700">{currentTemplateObj.name}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={clearTemplate}>
                            {t("action.clear")}
                        </Button>
                    </div>
                )}

                {templates.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">{t("messages.no_templates_available")}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <Card
                                key={template.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow hover:border-indigo-400"
                                onClick={() => openPreview(template)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                    {template.description && (
                                        <CardDescription>{template.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center text-gray-400 text-sm">
                                        {t("messages.click_to_preview")}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-6xl w-full max-h-[95vh]  p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="p-6 pb-3 shrink-0">
                        <DialogTitle className="text-2xl">
                            {selectedTemplate?.name || t("messages.template_preview")}
                        </DialogTitle>
                        {selectedTemplate?.description && (
                            <DialogDescription className="text-base">
                                {selectedTemplate.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <ScrollArea className="flex-1 px-6 pb-6">
                        <div className="bg-white rounded-lg border shadow-sm">
                            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                            <div className="p-8 pt-10">
                                {selectedTemplate && (
                                    <div
                                        className="prose prose-lg max-w-none [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:table-auto"
                                        dangerouslySetInnerHTML={{ __html: selectedTemplate.template }}
                                    />
                                )}
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-6 pt-4 border-t shrink-0">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {t("action.cancel")}
                        </Button>
                        <Button onClick={confirmTemplate} className="bg-indigo-600 hover:bg-indigo-700">
                            {t("messages.use_this_template")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};