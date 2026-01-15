import { type JSX } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Mail, User } from "lucide-react";
import { t } from "i18next";
import type { Client } from "@/api/ClientsApi.ts";

interface Props {
    groupId: string | undefined;
    client: Client;
}

export const ClientCardList = ({groupId, client}: Props):JSX.Element => {
    return (
        <Card key={client.id} className="hover:bg-muted/40 transition-colors">
            <Link to={`/dashboard/group/${groupId}/client/${client.id}`}>
                <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-full bg-muted p-2">
                            <User className="h-5 w-5 text-muted-foreground"/>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="font-medium leading-tight truncate">
                                {client.name} {client.surname}
                            </h3>

                            {client.email ? (
                                <div
                                    className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5"/>
                                    <span className="truncate">{client.email}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    {t("clients.no_email")}
                                </p>
                            )}

                            {client.phone && (
                                <p className="text-sm text-muted-foreground">
                                    {client.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    )
}