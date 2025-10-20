import { observer } from "mobx-react-lite";
import { authStore } from "@/store/auth.ts";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";

const Navbar = observer(() => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setOpen(!open)}
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>

            </div>

            <div className="flex items-center gap-4">
                {authStore.user && (
                    <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-800">
              {authStore.user.name}
            </span>
                        <span className="text-xs text-gray-500">{authStore.user.email}</span>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
});

export default Navbar;
