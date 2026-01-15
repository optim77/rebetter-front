import { NavLink, useParams } from "react-router-dom";
import { Building2, Users, LayoutDashboard, Briefcase, Vote } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
    const { t } = useTranslation();
    const { groupId } = useParams();

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 p-2 rounded-md transition ${
            isActive ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <aside className="w-64 bg-white border-r p-4 h-screen">
            <h1 className="text-xl font-bold mb-6 text-indigo-600">ReBetter</h1>
            <nav className="flex flex-col space-y-2">

                <NavLink to="/dashboard/companies" className={linkClasses}>
                    <Building2 className="w-4 h-4" />
                    {t("sidebar.companies")}
                </NavLink>

                {groupId && (
                    <>
                        <NavLink to={`/dashboard/group/${groupId}`} className={linkClasses}>
                            <LayoutDashboard className="w-4 h-4" />
                            {t("sidebar.dashboard")}
                        </NavLink>

                        <NavLink to={`/dashboard/group/${groupId}/clients`} className={linkClasses}>
                            <Users className="w-4 h-4" />
                            {t("sidebar.clients")}
                        </NavLink>

                        {/*<NavLink to={`/dashboard/group/${companyId}/campaign`} className={linkClasses}>*/}
                        {/*    <TicketsPlane className="w-4 h-4" />*/}
                        {/*    {t("sidebar.campaign")}*/}
                        {/*</NavLink>*/}

                        <NavLink to={`/dashboard/group/${groupId}/services`} className={linkClasses}>
                            <Briefcase className="w-4 h-4" />
                            {t("sidebar.services")}
                        </NavLink>

                        <NavLink to={`/dashboard/group/${groupId}/surveys`} className={linkClasses}>
                            <Vote className="w-4 h-4" />
                            {t("sidebar.surveys")}
                        </NavLink>

                    </>
                )}
            </nav>
        </aside>
    );
}
