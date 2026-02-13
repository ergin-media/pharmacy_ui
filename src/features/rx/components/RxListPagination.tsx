import { Button } from "@/components/ui/button";

export function RxListPagination(props: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    showStatus?: boolean;
}) {
    const {
        page,
        totalPages,
        onPageChange,
        isLoading = false,
        showStatus = true,
    } = props;

    const disablePrev = isLoading || page === 1;
    const disableNext = isLoading || page >= totalPages;

    return (
        <div
            className={[
                "flex items-center gap-3 flex-wrap",
                showStatus ? "justify-between" : "justify-end",
            ].join(" ")}
        >
            {showStatus && (
                <div className="text-sm text-muted-foreground">
                    Seite{" "}
                    <span className="font-medium text-foreground">{page}</span>{" "}
                    / {totalPages}
                </div>
            )}

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={disablePrev}
                >
                    {"<<"}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={disablePrev}
                >
                    {"<"}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={disableNext}
                >
                    {">"}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={disableNext}
                >
                    {">>"}
                </Button>
            </div>
        </div>
    );
}
