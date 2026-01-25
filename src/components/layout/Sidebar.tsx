import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Building2, Users, LayoutDashboard, Briefcase, Vote, LogOut, User2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { authStore } from "@/store/auth.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const { t } = useTranslation();
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center rounded-lg transition-colors
    ${
            collapsed
                ? "justify-center h-10 w-10 mx-auto"
                : "gap-3 px-3 py-2.5"
        }
    ${
            isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`;

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };

    const SidebarItem = ({ children, label }: { children: React.ReactNode; label: string }) => {
        if (!collapsed) return <>{children}</>;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger >{children}</TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <aside
            className={`relative bg-background border-r flex flex-col sticky top-0 h-screen overflow-hidden
    transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="absolute right-3 top-150 z-10 h-6 w-6"
            >
                {collapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
            </Button>
            <div className="flex items-center justify-between p-6 pb-2">
                {!collapsed ? (
                    <h1 className="text-2xl font-bold tracking-tight text-foreground ml-2">
                        ReBetter
                    </h1>
                ) : (
                    <p className="text-lg text-center font-bold tracking-tight text-foreground mt-2">
                        R
                    </p>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                <SidebarItem label={t("sidebar.groups")}>
                    <NavLink to="/dashboard/companies" className={linkClasses}>
                        <Building2 className="h-5 w-5"/>
                        {!collapsed && t("sidebar.groups")}
                    </NavLink>
                </SidebarItem>

                {groupId && (
                    <>
                        <SidebarItem label={t("sidebar.groups")}>
                            <NavLink to={`/dashboard/group/${groupId}`} className={linkClasses}>
                                <LayoutDashboard className="h-5 w-5"/>
                                {!collapsed && t("sidebar.dashboard")}
                            </NavLink>
                        </SidebarItem>

                        <SidebarItem label={t("sidebar.clients")}>
                            <NavLink to={`/dashboard/group/${groupId}/clients`} className={linkClasses}>
                                <Users className="h-5 w-5"/>
                                {!collapsed && t("sidebar.clients")}
                            </NavLink>
                        </SidebarItem>
                        <SidebarItem label={t("sidebar.services")}>
                            <NavLink to={`/dashboard/group/${groupId}/services`} className={linkClasses}>
                                <Briefcase className="h-5 w-5"/>
                                {!collapsed && t("sidebar.services")}
                            </NavLink>
                        </SidebarItem>
                        <SidebarItem label={t("sidebar.services")}>
                            <NavLink to={`/dashboard/group/${groupId}/surveys`} className={linkClasses}>
                                <Vote className="h-5 w-5"/>
                                {!collapsed && t("sidebar.surveys")}
                            </NavLink>
                        </SidebarItem>
                    </>
                )}
            </nav>

            <div className="p-4 border-t mt-auto">

                <div className="flex items-center justify-between">
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