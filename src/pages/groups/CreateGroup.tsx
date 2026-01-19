import { useState } from "react";
import { t } from "i18next";
import { useCreateGroup } from "@/hooks/useCreateGroup.ts";
import { Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/elements/FormSubmitButton.tsx";

const socialOptions = [
    { key: "googleReviewLink", label: "Google", icon: Building2 },
    { key: "facebookUrl", label: "Facebook", icon: Building2 },
    { key: "instagramUrl", label: "Instagram", icon: Building2 },
    { key: "linkedinUrl", label: "LinkedIn", icon: Building2 },
    { key: "tiktokUrl", label: "TikTok", icon: Building2 },
    { key: "znanyLekarzUrl", label: "Znany Lekarz", icon: Building2 },
    { key: "booksyUrl", label: "Booksy", icon: Building2 },
];

export default function CreateGroup() {
    const [activeSocials, setActiveSocials] = useState<string[]>([]);

    const toggleSocial = (key: string) => {
        setActiveSocials((prev) =>
            prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
        );
    };

    const { handleSubmit, form, handleChange, mutation } = useCreateGroup();

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("groups.create_title")}
                    </h1>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t("groups.create_description")}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Podstawowe informacje */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">{t("groups.basic_info")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                {t("groups.name", { defaultValue: "Company name" })}{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => handleChange("name")(e.target.value)}
                                placeholder={t("groups.name_placeholder")}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                {t("groups.description", { defaultValue: "Description" })}
                            </Label>
                            <Textarea
                                id="description"
                                value={form.description || ""}
                                onChange={(e) => handleChange("description")(e.target.value)}
                                placeholder={t("groups.description_placeholder")}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">{t("groups.social_media")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {socialOptions.map(({ key, label, icon: Icon }) => {
                                const isActive = activeSocials.includes(key);

                                return (
                                    <Button
                                        key={key}
                                        type="button"
                                        variant={isActive ? "default" : "outline"}
                                        className="h-auto py-4 flex flex-col gap-2"
                                        onClick={() => toggleSocial(key)}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <span className="text-sm">{label}</span>
                                        {isActive && <Check className="h-4 w-4 absolute top-2 right-2" />}
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {activeSocials.length > 0 && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                                {t("groups.social_links")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {activeSocials.map((key) => {
                                const option = socialOptions.find((opt) => opt.key === key);
                                const label = option?.label || key;

                                return (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={key}>{label} URL</Label>
                                        <Input
                                            id={key}
                                            type="url"
                                            value={(form[key as keyof typeof form] as string) || ""}
                                            onChange={(e) => handleChange(key as keyof typeof form)(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                <FormSubmitButton isPending={mutation.isPending} />
            </form>
        </div>
    );
}