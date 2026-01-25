import { type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { useGroup } from "@/hooks/useGroup.ts";
import AddServiceButton from "@/components/elements/AddServiceButton.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "i18next";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function DashboardCompany(): JSX.Element {
    const { groupId } = useParams<{ groupId: string }>();
    const { query } = useGroup(groupId!);
    const groupName = query.data?.name;

    if (query.isLoading) return <BaseSpinner />

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {groupName}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t("dashboard.group_overview")}
                    </p>

                </div>
                <div>
                    {/* TODO: add logic*/}
                    <Button className="mr-2" variant="outline" size="sm" asChild>
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


            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="h-full">
                    <CardContent
                        className="p-6 flex flex-col items-center justify-center min-h-[220px] text-center">
                        <AddServiceButton groupId={groupId!}/>
                        </CardContent>
                    </Card>

                </div>
            </div>
            );
            }