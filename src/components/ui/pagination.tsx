import { Button } from "@/components/ui/button";

export function Pagination(props: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    showStatus?: boolean;
    className?: string;
}) {
    const {
        page,
        totalPages,
        onPageChange,
        isLoading = false,
        showStatus = true,
        className,
    } = props;

    const safeTotalPages = Math.max(1, totalPages);
    const safePage = Math.min(Math.max(1, page), safeTotalPages);

    const disablePrev = isLoading || safePage <= 1;
    const disableNext = isLoading || safePage >= safeTotalPages;

    return (
        <div
            className={[
                "flex flex-wrap items-center gap-3",
                showStatus ? "justify-between" : "justify-end",
                className ?? "",
            ].join(" ")}
        >
            {showStatus ? (
                <div className="text-sm text-muted-foreground">
                    Seite{" "}
                    <span className="font-medium text-foreground">
                        {safePage}
                    </span>{" "}
                    / {safeTotalPages}
                </div>
            ) : null}

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
                    onClick={() => onPageChange(Math.max(1, safePage - 1))}
                    disabled={disablePrev}
                >
                    {"<"}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        onPageChange(Math.min(safeTotalPages, safePage + 1))
                    }
                    disabled={disableNext}
                >
                    {">"}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(safeTotalPages)}
                    disabled={disableNext}
                >
                    {">>"}
                </Button>
            </div>
        </div>
    );
}
