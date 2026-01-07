import { type JSX, useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Plus, Download, Eye } from "lucide-react";
import { t } from "i18next";

export const CreateTemplate = (): JSX.Element => {
    const emailEditorRef = useRef<any>(null);
    const [templateName, setTemplateName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const onReady = () => {
        setIsLoading(false);
        // Możesz tu załadować domyślny szablon
        // emailEditorRef.current?.loadDesign(defaultTemplate);
    };

    const exportHtml = () => {
        if (!templateName.trim()) {
            toast.error("Wpisz nazwę szablonu przed eksportem");
            return;
        }

        emailEditorRef.current?.exportHtml((data: any) => {
            const { design, html } = data;

            // Tu możesz zapisać do backendu
            console.log("Nazwa szablonu:", templateName);
            console.log("JSON design:", design);
            console.log("HTML:", html);

            toast.success(`Szablon "${templateName}" wyeksportowany!`);

            const savedTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
            savedTemplates.push({
                name: templateName,
                design,
                html,
                createdAt: new Date().toISOString(),
            });
            localStorage.setItem("emailTemplates", JSON.stringify(savedTemplates));
        });
    };

    const saveDraft = () => {
        emailEditorRef.current?.saveDesign((design: any) => {
            localStorage.setItem("draftTemplate", JSON.stringify(design));
            toast.success("Szkic zapisany!");
        });
    };

    const loadDraft = () => {
        const draft = localStorage.getItem("draftTemplate");
        if (draft) {
            emailEditorRef.current?.loadDesign(JSON.parse(draft));
            toast.success("Szkic wczytany!");
        } else {
            toast.error("Brak szkicu do wczytania");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 pt-12"
            >
                <div className="max-w-7xl mx-auto mb-8">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {t("templates.create_heading")}

                    </h1>
                    <p className="text-xl text-gray-600">
                        Twórz piękne, responsywne e-maile metodą drag & drop
                    </p>
                </div>

                <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1 max-w-md">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                {t("templates.name")}
                            </label>
                            <input
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Np. Powitalny newsletter, Promocja weekendowa..."
                                className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 bg-white/70 shadow-inner"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={loadDraft}
                                variant="outline"
                                className="rounded-2xl"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Wczytaj szkic
                            </Button>

                            <Button
                                onClick={saveDraft}
                                variant="outline"
                                className="rounded-2xl"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Zapisz szkic
                            </Button>

                            <Button
                                onClick={exportHtml}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Eksportuj HTML
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Edytor */}
                <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                    {isLoading && (
                        <div className="h-96 flex items-center justify-center">
                            <p className="text-gray-600">Ładowanie edytora...</p>
                        </div>
                    )}

                    <EmailEditor
                        ref={emailEditorRef}
                        onReady={onReady}
                        style={{ height: "80vh" }}
                        options={{
                            appearance: {
                                theme: "dark", // lub "light"
                                panels: {
                                    tools: {
                                        dock: "right",
                                    },
                                },
                            },
                            features: {
                                preview: true,
                                undoRedo: true,
                            },
                            locale: "pl", // jeśli masz tłumaczenie

                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};