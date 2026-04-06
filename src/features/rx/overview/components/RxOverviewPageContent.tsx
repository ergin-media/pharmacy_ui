import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxOverviewTable } from "./RxOverviewTable";

export function RxOverviewPageContent(props: {
    vm: ReturnType<typeof import("../hooks/useRxOverviewPage").useRxOverviewPage>;
}) {
    const { vm } = props;

    return (
        <Card>
            <CardContent className="grid gap-4">
                {vm.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(vm.error as Error)?.message ?? "unknown"}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => vm.query.refetch()}
                        >
                            Erneut versuchen
                        </Button>
                    </div>
                ) : null}

                <RxOverviewTable
                    items={vm.items}
                    isLoading={vm.isLoading}
                />
            </CardContent>
        </Card>
    );
}