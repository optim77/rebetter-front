import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, User, Edit, Trash2, MessageSquare, NotepadText } from "lucide-react";
import { t } from "i18next";
import { type Client, clientsApi } from "@/api/ClientsApi.ts";
import { ClientMessagesList } from "@/components/client/ClientMessagesList.tsx";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";


export default function Client() {
    const { groupId, clientId } = useParams<{ groupId: string; clientId: string }>();

    const { data: client, isLoading, isError } = useQuery({
        queryKey: ["client", groupId, clientId],
        queryFn: async (): Promise<Client> => {
            if (!groupId || !clientId) throw new Error("Missing IDs");
            return clientsApi.getClient(groupId, clientId);
        },
        enabled: !!groupId && !!clientId,
    });

    if (isLoading) return <BaseSpinner />

    if (isError || !client) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium text-destructive">
                        {t("errors.client_not_found")}
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link to={`/dashboard/group/${groupId}/clients`}>
                            {t("action.back_to_list")}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/group/${groupId}/clients`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {client.name} {client.surname}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t("clients.client_details")}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="edit">
                            <Edit className="mr-2 h-4 w-4" />
                            {t("action.edit")}
                        </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("action.delete")}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                <Card className="lg:col-span-1 h-fit">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3">
                            <User className="h-5 w-5" />
                            {t("clients.client_info")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t("clients.name")}</p>
                            <p className="font-medium">{client.name || "—"} {client.surname}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t("clients.email")}</p>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground"/>
                                <p className="font-medium">{client.email || "—"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t("clients.phone")}</p>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground"/>
                                <p className="font-medium">{client.phone || "—"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t("clients.note")}</p>
                            <div className="flex items-center gap-2">
                                <NotepadText className="h-4 w-4 text-muted-foreground"/>
                                <p className="font-medium">{client.note}</p>
                            </div>
                        </div>


                        <div className="pt-4 border-t space-y-3">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="send_email">
                                    <Mail className="mr-3 h-4 w-4"/>
                                    {t("clients.send_email")}
                                </Link>
                            </Button>

                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="send_sms">
                                    <MessageSquare className="mr-3 h-4 w-4"/>
                                    {t("clients.send_sms")}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>


                <Card className="lg:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5"/>
                            {t("messages.history")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <ClientMessagesList />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}