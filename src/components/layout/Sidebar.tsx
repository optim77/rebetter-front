import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Building2, Users, LayoutDashboard, Briefcase, Vote, LogOut, User2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { authStore } from "@/store/auth.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Sidebar() {
    const { t } = useTranslation();
    const { groupId } = useParams();
    const navigate = useNavigate();

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`;

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };

    return (
        <aside className="w-64 bg-background border-r flex flex-col sticky top-0 h-screen overflow-hidden">
            <div className="p-6 pb-8 shrink-0">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    ReBetter
                </h1>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                <NavLink to="/dashboard/companies" className={linkClasses}>
                    <Building2 className="h-5 w-5"/>
                    {t("sidebar.groups")}
                </NavLink>

                {groupId && (
                    <>
                        <NavLink to={`/dashboard/group/${groupId}`} className={linkClasses}>
                            <LayoutDashboard className="h-5 w-5"/>
                            {t("sidebar.dashboard")}
                        </NavLink>

                        <NavLink to={`/dashboard/group/${groupId}/clients`} className={linkClasses}>
                            <Users className="h-5 w-5"/>
                            {t("sidebar.clients")}
                        </NavLink>

                        <NavLink to={`/dashboard/group/${groupId}/services`} className={linkClasses}>
                            <Briefcase className="h-5 w-5"/>
                            {t("sidebar.services")}
                        </NavLink>

                        <NavLink to={`/dashboard/group/${groupId}/surveys`} className={linkClasses}>
                            <Vote className="h-5 w-5"/>
                            {t("sidebar.surveys")}
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="p-4 border-t mt-auto">
                <div className="flex items-center justify-between">
                    {/* Avatar + Profil */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="rounded-full h-10 w-10"
                                    onClick={() => navigate("/dashboard/profile")}
                                >
                                    <User2/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {t("sidebar.account")}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {t("action.logout")}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </aside>
    );
}