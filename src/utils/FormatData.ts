import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { t } from "i18next";

export const formatDate = (dateStr: string | null) =>
    dateStr ? format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: pl }) : t("common.none");