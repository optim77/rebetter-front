import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../store/auth";

import LandingPage from "@/pages/Landing.tsx";
import Login from "@/pages/auth/Login.tsx";
import Register from "@/pages/auth/Register.tsx";
import DashboardHome from "@/pages/dashboard/DashboardHome.tsx";
import Companies from "@/pages/dashboard/Companies.tsx";
import Clients from "@/pages/dashboard/Clients.tsx";
import Navbar from "@/components/layout/Navbar.tsx";
import { Sidebar } from "lucide-react";

const PrivateRoute = observer(() => {
    if (!authStore.token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
});

function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="companies" element={<Companies />} />
                        <Route path="clients" element={<Clients />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
