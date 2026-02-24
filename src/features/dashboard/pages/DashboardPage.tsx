import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="space-y-4">
                <div className="text-6xl font-bold tracking-tight text-muted-foreground">
                    Dashboard
                </div>
            </div>
        </div>
    );
}
