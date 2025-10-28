import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { t } from "i18next";
import { clientsApi } from "@/api/clientsApi.ts";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company_id: string;
}

export default function Client() {
    const { companyId, clientId } = useParams<{ companyId: string; clientId: string }>();
    const [open, setOpen] = useState(false);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["client", companyId, clientId],
        queryFn: async (): Promise<Client> => {
            if (!companyId || !clientId) throw new Error("Companies not found!");
            return clientsApi.getClient(companyId, clientId);
        },
        enabled: !!companyId && !!clientId,
    });

    if (isLoading) return <p>{t("action.loading")}</p>;
    if (isError || !data) return <p>{t("errors.client_not_found")}</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/company/${companyId}/clients`}>
                        <Button className="mt-2" variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t("action.back")}
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                </div>
            </div>

            <Card className="text-center">
                <CardContent className="space-y-3 pt-6">
                    <div>
                        <p className="text-sm text-gray-500">{t("clients.email")}</p>
                        <p className="font-medium">{data.email || "-"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">{t("clients.phone")}</p>
                        <p className="font-medium">{data.phone || "-"}</p>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setOpen(true)}>
                                    <Send className="w-4 h-4 mr-2" />
                                    {t("messages.send_sms_message")}
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{t("messages.send_sms_message")}</DialogTitle>
                                    <DialogDescription>
                                        {t("messages.send_message_description")}
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    className="space-y-4 mt-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setOpen(false);
                                    }}
                                >
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-medium">
                                            {t("messages.content")}
                                        </label>
                                        <Textarea
                                            placeholder={t("messages.content_placeholder") || ""}
                                            rows={5}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">

                                        <Button type="submit">{t("action.send")}</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button>{t("action.edit")}</Button>
                        <Button variant="destructive">{t("action.delete")}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
