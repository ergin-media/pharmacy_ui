import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

export function RxQueueTabsSkeleton() {
    return (
        <Card className="gap-3 p-4">
            <TypographyP className="pl-1 text-[.7rem] uppercase text-gray-400">
                Prozesse
            </TypographyP>

            <div className="grid gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-md border border-transparent px-3 py-2"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>

                        <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                ))}
            </div>
        </Card>
    );
}