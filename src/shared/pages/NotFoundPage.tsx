import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="space-y-4">
                <div className="text-6xl font-bold tracking-tight text-muted-foreground">
                    404
                </div>

                <div className="text-xl font-medium">Seite nicht gefunden</div>

                <div className="text-sm text-muted-foreground">
                    Die angeforderte Route existiert nicht oder wurde
                    verschoben.
                </div>

                <div className="pt-4">
                    <Button>
                        <Link to="/">Zurück zum Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
