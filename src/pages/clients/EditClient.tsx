import { type JSX, useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { t } from "i18next";
import { type Client, clientsApi } from "@/api/ClientsApi.ts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, NotepadText, UserPlus } from "lucide-react";
import { FormTextarea } from "@/components/elements/FormTextarea.tsx";
import { FormInput } from "@/components/elements/FormInput.tsx";
import { BaseSpinner } from "@/components/elements/BaseSpinner.tsx";
import { EditClientNoFound } from "@/components/client/elements/EditClientNoFound.tsx";

export const EditClient = (): JSX.Element => {
    const {groupId, clientId} = useParams<{ groupId: string; clientId: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<Client>({
        id: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        note: "",
        company_id: groupId || "",
    });

    const {data, isLoading, isError} = useQuery({
        queryKey: ["clientEdit", groupId, clientId],
        queryFn: async (): Promise<Client> => clientsApi.getClient(groupId!, clientId!),
        enabled: !!groupId && !!clientId,
    });

    useEffect(() => {
        if (data) {
            setForm(data);
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!groupId || !clientId) throw new Error("Brak ID firmy lub klienta");
            return clientsApi.updateClient(groupId, clientId, form);
        },
        onSuccess: () => {
            toast.success(t("clients.updated_successfully"));
            navigate(`/dashboard/group/${groupId}/client/${clientId}`);
        },
        onError: () => {
            toast.error(t("errors.update_failed"));
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    if (isLoading) return <BaseSpinner />

    if (isError || !data) {
        return (
            <EditClientNoFound groupId={groupId} />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/group/${groupId}/client/${clientId}`}>
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t("clients.edit_client")}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {form.name} {form.surname}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                <FormInput
                    icon={<UserPlus className="h-4 w-4"/>}
                    id={"name"}
                    type={"text"}
                    name={"name"}
                    value={form.name}
                    handleChange={handleChange}
                    placeholder={t("clients.name_placeholder")}
                    required={false}
                />

                <FormInput
                    icon={<UserPlus className="h-4 w-4"/>}
                    id={"surname"}
                    type={"text"}
                    name={"surname"}
                    value={form.surname}
                    handleChange={handleChange}
                    placeholder={t("clients.surname_placeholder")}
                    required={false}
                />

                <FormInput
                    icon={<Mail className="h-4 w-4" />}
                    id={"email"}
                    type={"email"}
                    name={"email"}
                    value={form.email}
                    handleChange={handleChange}
                    placeholder={"email@domain.com"}
                    required={true}
                />


                <FormInput
                    icon={<Phone className="h-4 w-4"/>}
                    id={"phone"} type={"tel"}
                    name={"phone"}
                    value={form.phone}
                    handleChange={handleChange}
                    placeholder={"+48 123 456 789"}
                    required={false}
                />

                <FormTextarea
                    icon={<NotepadText
                        className="h-4 w-4"/>}
                    id={"note"}
                    name={"note"}
                    value={form.note}
                    handleChange={handleChange}
                    placeholder={t("clients.note_placeholder")}
                    required={false}
                />

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full"
                        size="lg"
                    >
                        {mutation.isPending ? t("action.saving") : t("action.save_changes")}
                    </Button>
                </div>
            </form>
        </div>
    );
};