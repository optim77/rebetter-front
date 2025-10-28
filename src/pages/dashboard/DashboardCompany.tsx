import { type JSX } from "react";
import AddServiceButton from "@/components/elements/AddServiceButton.tsx";
import ReviewStats from "@/components/elements/ReviewStats.tsx";
import { useParams } from "react-router-dom";
import { useCompany } from "@/hooks/useCompany.ts";
import MediaAddress from "@/components/elements/MediaAddress.tsx";

export default function DashboardCompany(): JSX.Element {
    const { companyId } = useParams<{ companyId: string }>();
    const { query } = useCompany(companyId);

    return (
        <main>
            <div className="grid grid-cols-3 gap-4 mt-10">
                <AddServiceButton />
                <ReviewStats />
                <MediaAddress data={query.data} />
            </div>
        </main>
    )

}