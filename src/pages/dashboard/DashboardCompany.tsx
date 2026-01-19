import { type JSX } from "react";
import { useParams } from "react-router-dom";
import { useGroup } from "@/hooks/useGroup.ts";
import AddServiceButton from "@/components/elements/AddServiceButton.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "i18next";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";

export default function DashboardCompany(): JSX.Element {
    const { groupId } = useParams<{ groupId: string }>();
    const { query } = useGroup(groupId!);
    const companyName = query.data?.name;

    if (query.isLoading) return <BaseSpinner />

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {companyName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t("dashboard.group_overview")}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="h-full">
                    <CardContent className="p-6 flex flex-col items-center justify-center min-h-[220px] text-center">
                        <AddServiceButton groupId={groupId!} />
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}