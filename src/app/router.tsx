import { createBrowserRouter } from "react-router";
import { AppShell } from "@/app/layout/AppShell";
import { RxListPage } from "@/features/rx/pages/RxListPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { RouteErrorBoundary } from "@/shared/pages/RouteErrorBoundary";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { PharmacyProductsListPage } from "@/features/pharmacy-products/pages/PharmacyProductsListPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />, // ✅ fängt 404/Errors ab
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "rx", element: <RxListPage /> },
            { path: "products", element: <PharmacyProductsListPage /> },

            // optional: klassischer Fallback innerhalb des Layouts
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
