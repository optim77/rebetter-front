import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { toast } from "react-hot-toast";
import { UserPlus, Mail, Phone, NotepadText } from "lucide-react";
import { clientsApi } from "@/api/ClientsApi.ts";
import type { ApiError } from "@/types/apiError.ts";
import { handleApiError } from "@/utils/handleApiError.ts";
import { FormInput } from "@/components/elements/FormInput.tsx";
import { FormTextarea } from "@/components/elements/FormTextarea.tsx";
import { FormSubmitButton } from "@/components/elements/FormSubmitButton.tsx";

export default function CreateClient() {
    const { companyId } = useParams<{ companyId: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        note: "",
        company: companyId,
    });

    const mutation = useMutation({
        mutationFn: async () => clientsApi.createClient(form, companyId!),
        onSuccess: () => {
            toast.success(t("clients.created_successfully"));
            navigate(`/dashboard/group/${companyId}/clients`);
        },
        onError: (error) => {
            const apiError: ApiError = handleApiError(error);
            toast.error(t(`errors.${apiError.message}`) || apiError.message);
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <UserPlus className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("clients.add_client")}
                    </h1>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t("clients.add_client_description")}
                </p>
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
                    id={"phone"}
                    type={"text"}
                    name={"phone"}
                    value={form.phone}
                    handleChange={handleChange}
                    placeholder={"+48 123 456 789"}
                    required={false}
                />

                <FormTextarea
                    icon={<NotepadText className="h-4 w-4"/>}
                    id={"note"}
                    name={"note"}
                    value={form.note}
                    handleChange={handleChange}
                    placeholder={t("clients.note_placeholder")}
                    required={false}
                />

                <FormSubmitButton isPending={mutation.isPending} />

            </form>
        </div>
    );
}