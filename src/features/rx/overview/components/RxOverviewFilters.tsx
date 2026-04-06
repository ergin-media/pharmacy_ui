import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RxOverviewFilters(props: {
    filters: {
        search: string;
        status?: string;
        onlyAttention: boolean;
    };
    onChange: (patch: Partial<typeof props.filters>) => void;
}) {
    const { filters, onChange } = props;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Input
                placeholder="Suche…"
                value={filters.search}
                onChange={(e) =>
                    onChange({ search: e.target.value })
                }
                className="w-60"
            />

            <Button
                variant={!filters.status ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ status: undefined })}
            >
                Alle
            </Button>

            <Button
                variant={filters.status === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ status: "open" })}
            >
                Offen
            </Button>

            <Button
                variant={filters.onlyAttention ? "destructive" : "outline"}
                size="sm"
                onClick={() =>
                    onChange({ onlyAttention: !filters.onlyAttention })
                }
            >
                Handlungsbedarf
            </Button>

            <Button
                variant={filters.status === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ status: "completed" })}
            >
                Abgeschlossen
            </Button>
        </div>
    );
}