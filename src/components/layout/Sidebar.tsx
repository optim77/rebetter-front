import { NavLink } from "react-router-dom";
import { Building2, Users } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r p-4">
            <h1 className="text-xl font-bold mb-6">ReBetter</h1>
            <nav className="flex flex-col space-y-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-blue-100" : ""}`
                    }
                >
                    <Building2 className="w-4 h-4" /> Dashboard
                </NavLink>
                <NavLink
                    to="/dashboard/companies"
                    className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-blue-100" : ""}`
                    }
                >
                    <Building2 className="w-4 h-4" /> Companies
                </NavLink>
                <NavLink
                    to="/dashboard/clients"
                    className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-blue-100" : ""}`
                    }
                >
                    <Users className="w-4 h-4" /> Clients
                </NavLink>
            </nav>
        </aside>
    );
}
