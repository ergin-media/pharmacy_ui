// src/features/dashboard/components/DashboardPageSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

function DashboardCardSkeleton(props: {
    className?: string;
    header?: boolean;
    chart?: boolean;
}) {
    const { className, header = true, chart = true } = props;

    return (
        <div className={["rounded-lg bg-white p-4", className].filter(Boolean).join(" ")}>
            {header ? (
                <div className="mb-4 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                </div>
            ) : null}

            {chart ? <Skeleton className="h-72 w-full rounded-md" /> : null}
        </div>
    );
}

export function DashboardPageSkeleton() {
    return (
        <div className="grid gap-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-3 w-56" />
                </div>

                <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            {/* Hero */}
            <div className="rounded-lg bg-white p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-3 w-40" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Growth Message */}
            <div className="rounded-lg bg-white p-4">
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            {/* Daily Activity */}
            <div className="rounded-lg bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                    </div>

                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>

                <Skeleton className="h-72 w-full rounded-md" />
            </div>

            {/* Cash Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="mt-2 h-3 w-36" />
                    </div>
                ))}
            </div>

            {/* Top Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
            </div>

            {/* Risk Cards */}
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-4 rounded-sm" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>

            {/* Bottom Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
            </div>
        </div>
    );
}