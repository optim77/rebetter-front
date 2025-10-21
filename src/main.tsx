import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import "./i18n/config";
import { AuthProvider } from "@/context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <AuthProvider>
                <AppRouter />
                <Toaster position="top-center" />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
