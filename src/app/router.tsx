import { createBrowserRouter, Navigate } from "react-router";
import { AppShell } from "@/shared/ui/AppShell";
import { RxListPage } from "@/features/rx/pages/RxListPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        children: [
            { index: true, element: <Navigate to="/rx" replace /> },
            { path: "rx", element: <RxListPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
