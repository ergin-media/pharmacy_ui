import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    MAPPED_TABS,
    type MappedTabValue,
} from "../lib/provider-products.constants";

export function ProviderProductsMappingsToolbar(props: {
    total: number;

    tabValue: MappedTabValue;
    onTabChange: (v: MappedTabValue) => void;

    search: string;
    onSearchChange: (v: string) => void;

    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;

    perPage: number;
    perPageOptions: readonly number[];
    onPerPageChange: (perPage: number) => void;

    isLoading?: boolean;
    disableControls?: boolean;
}) {
    const {
        total,
        tabValue,
        onTabChange,
        search,
        onSearchChange,
        page,
        totalPages,
        onPageChange,
        perPage,
        perPageOptions,
        onPerPageChange,
        isLoading = false,
        disableControls = false,
    } = props;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                    <span className="me-1">Gesamt:</span>
                    <span className="font-medium text-foreground">{total}</span>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <Tabs
                    value={tabValue}
                    onValueChange={(v) => onTabChange(v as MappedTabValue)}
                >
                    <TabsList className="flex flex-wrap">
                        {MAPPED_TABS.map((t) => (
                            <TabsTrigger
                                key={t.value}
                                value={t.value}
                                disabled={disableControls}
                            >
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <Separator orientation="vertical" className="h-4" />

                <div className="w-full sm:w-96">
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Suche (externer Name)…"
                        disabled={disableControls}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Per Page */}
                <Select
                    value={String(perPage)}
                    onValueChange={(v) => onPerPageChange(Number(v))}
                    disabled={disableControls}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Pro Seite" />
                    </SelectTrigger>
                    <SelectContent>
                        {perPageOptions.map((n) => (
                            <SelectItem key={n} value={String(n)}>
                                {n} / Seite
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-4" />
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    isLoading={isLoading}
                    showStatus={false}
                />
            </div>
        </div>
    );
}
