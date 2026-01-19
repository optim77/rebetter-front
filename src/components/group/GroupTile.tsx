import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Building2 } from "lucide-react";
import { t } from "i18next";
import { type JSX } from "react";
import type { Group } from "@/api/GroupsApi.ts";

interface Props {
    group: Group;
}

export const GroupTile = ({group}: Props):JSX.Element => {
    return (
        <Card
            key={group.id}
            className="overflow-hidden transition-colors hover:border-primary/50"
        >
            <Link to={`/dashboard/group/${group.id}`}>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-semibold leading-tight">
                                {group.name}
                            </h3>

                            {group.description ? (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                    {group.description}
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-muted-foreground italic">
                                    {t("groups.no_description")}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    )
}