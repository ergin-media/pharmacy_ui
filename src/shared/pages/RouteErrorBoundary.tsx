import { isRouteErrorResponse, useRouteError } from "react-router";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

export function RouteErrorBoundary() {
    const err = useRouteError();

    // 404 / 401 / 500 etc. als RouteErrorResponse
    if (isRouteErrorResponse(err)) {
        if (err.status === 404) return <NotFoundPage />;

        return (
            <div className="p-6">
                <div className="text-sm font-medium">
                    Fehler ({err.status}): {err.statusText}
                </div>
                {err.data ? (
                    <pre className="mt-3 whitespace-pre-wrap rounded-md border bg-muted p-3 text-xs">
                        {String(err.data)}
                    </pre>
                ) : null}
            </div>
        );
    }

    // “normale” JS Errors
    const message = err instanceof Error ? err.message : String(err);

    return (
        <div className="p-6">
            <div className="text-sm font-medium">Unerwarteter Fehler</div>
            <div className="mt-1 text-sm text-muted-foreground">{message}</div>
        </div>
    );
}
