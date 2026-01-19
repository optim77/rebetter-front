import { type FallbackProps } from "react-error-boundary";
import type { JSX } from "react";
import { t } from "i18next";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ErrorFallback = ({
                                  error,
                                  resetErrorBoundary,
                              }: FallbackProps): JSX.Element => {
    
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive/30">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>

                    <CardTitle className="text-xl font-semibold">
                        {t("errors.render_error_head")}
                    </CardTitle>

                    <CardDescription className="mt-2">
                        {t("errors.render_error_desc")}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-expect-error */}
                    {import.meta.env.DEV && error?.message && (
                        <div className="rounded-md bg-muted p-4 text-sm font-mono text-destructive/90 overflow-auto max-h-40">
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-expect-error */}
                            {error.message}
                        </div>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                        {t("errors.error_boundary_info")}
                    </div>

                    <Button
                        onClick={resetErrorBoundary}
                        className="w-full gap-2"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {t("errors.try_again")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};