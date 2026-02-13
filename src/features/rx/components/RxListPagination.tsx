import { Button } from "@/components/ui/button";

export function RxListPagination(props: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const { page, totalPages, onPageChange } = props;

    return (
        <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-muted-foreground">
                Seite{" "}
                <span className="font-medium text-foreground">{page}</span> /{" "}
                {totalPages}
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                >
                    {"<<"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                >
                    {"<"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                >
                    {">"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={page >= totalPages}
                >
                    {">>"}
                </Button>
            </div>
        </div>
    );
}
