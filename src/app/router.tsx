import { createBrowserRouter } from "react-router";
import { AppShell } from "@/app/layout/AppShell";
import { RxListPage } from "@/features/rx/pages/RxListPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { RouteErrorBoundary } from "@/shared/pages/RouteErrorBoundary";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { PharmacyProductsListPage } from "@/features/pharmacy-products/pages/PharmacyProductsListPage";
import { ProviderProductsMappingsPage } from "@/features/provider-products/pages/ProviderProductsMappingsPage";
import { PatientsListPage } from "@/features/patients/pages/PatientsListPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "rx", element: <RxListPage /> },
            { path: "patients", element: <PatientsListPage /> },
            { path: "products", element: <PharmacyProductsListPage /> },
            {
                path: "products/mappings",
                element: <ProviderProductsMappingsPage />,
            },

            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
