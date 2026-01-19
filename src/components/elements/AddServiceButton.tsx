import { PlusCircle } from "lucide-react";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    groupId: string;
}

export default function AddServiceButton({ groupId }: Props) {
    return (
        <Card className="h-full border-dashed border-2 transition-colors hover:border-primary/50">
            <Link to={`/dashboard/group/${groupId}/create_service`} className="block h-full">
                <CardContent className="h-full flex flex-col items-center justify-center p-10 text-center">
                    <PlusCircle className="h-12 w-12 text-muted-foreground mb-6" />

                    <h3 className="text-xl font-semibold mb-3">
                        {t("services.add_service")}
                    </h3>

                    <p className="text-sm text-muted-foreground max-w-xs">
                        {t("services.add_service_description")}
                    </p>

                    <Button variant="outline" size="sm" className="mt-6 gap-2">
                        <PlusCircle className="h-4 w-4" />
                        {t("action.add")}
                    </Button>
                </CardContent>
            </Link>
        </Card>
    );
}