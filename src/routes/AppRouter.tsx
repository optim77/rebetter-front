import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../store/auth";

import LandingPage from "@/pages/Landing.tsx";
import Login from "@/pages/auth/Login.tsx";
import Register from "@/pages/auth/Register.tsx";
import Registered from "@/pages/Registered.tsx";

import Navbar from "@/components/layout/Navbar.tsx";
import Sidebar from "@/components/layout/Sidebar.tsx";
import DashboardCompany from "@/pages/dashboard/DashboardCompany.tsx";
import Companies from "@/pages/companies/Companies.tsx";
import CreateCompany from "@/pages/companies/CreateCompany.tsx";
import Clients from "@/pages/clients/Clients.tsx";
import CreateClient from "@/pages/clients/CreateClient.tsx";
import Client from "@/pages/clients/Client.tsx";
import Campaign from "@/pages/campaings/Campaign.tsx";
import Services from "@/pages/services/Services.tsx";
import DashboardHome from "@/pages/dashboard/DashboardHome.tsx";
import CreateService from "@/pages/services/CreateService.tsx";
import { SendSMSMessage } from "@/pages/messages/SendSMSMessage.tsx";
import { Review } from "@/pages/reviews/Review.tsx";
import { PostNegativeReviewView } from "@/components/review/PostNegativeReviewView.tsx";
import { SMSMessageDetails } from "@/pages/message/SMS/SMSMessageDetails.tsx";


const PrivateRoute = observer(() => {
    if (!authStore.token) return <Navigate to="/login" replace />;
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
                <Route path="/registered" element={<Registered />} />
                <Route path="/invitations/review/:companyId/:clientId/:trackingId" element={<Review />} />
                <Route path="/post_negative" element={<PostNegativeReviewView />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="create_company" element={<CreateCompany />} />
                        <Route path="companies" element={<Companies />} />

                        <Route path="company/:companyId" element={<Outlet />}>
                            <Route index element={<DashboardCompany />} />
                            <Route path="create_client" element={<CreateClient />} />
                            <Route path="client" element={<Client />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="campaign" element={<Campaign />} />
                            <Route path="services" element={<Services />} />
                            <Route path="create_service" element={<CreateService />} />
                        </Route>

                        <Route path="company/:companyId/client/:clientId" element={<Outlet />}>
                            <Route index element={<Client />} />
                            <Route path="send_sms" element={<SendSMSMessage/>} />
                            <Route path="sms_message_details/:smsId" element={<SMSMessageDetails/>} />
                        </Route>


                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
