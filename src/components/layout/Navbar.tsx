import { observer } from "mobx-react-lite";
import { authStore } from "@/store/auth.ts";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { t } from "i18next";

const Navbar = observer(() => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };

    return (
        <header className="relative z-50 border-b border-white/20 backdrop-blur-xl bg-white/80 shadow-lg">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

            <div className="mx-auto flex justify-between px-6 py-4 ">

                <div className="flex gap-4">

                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                </div>

                <div className="flex gap-6">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 transition-all duration-300 shadow-md "
                        title={t("action.logout")}
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
});

export default Navbar;