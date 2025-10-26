import { type JSX } from "react";
import AddServiceButton from "@/components/elements/AddServiceButton.tsx";
import ReviewStats from "@/components/elements/ReviewStats.tsx";

export default function DashboardCompany(): JSX.Element {
    return (
        <main>
            <div className="grid grid-cols-3 gap-4 mt-10">
                <AddServiceButton />
                <ReviewStats />
            </div>
        </main>
    )

}