"use client";

import * as React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
    value?: string | null;
    onChange: (value: string) => void;

    placeholder?: string;
    disabled?: boolean;
    className?: string;

    minDate?: Date;
    maxDate?: Date;
    clearable?: boolean;
};

function parseIsoDate(value?: string | null) {
    if (!value) return undefined;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function toIsoDate(date?: Date) {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
}

export function DatePicker(props: DatePickerProps) {
    const {
        value,
        onChange,
        placeholder = "Datum wählen",
        disabled,
        className,
        minDate,
        maxDate,
        clearable,
    } = props;

    const [open, setOpen] = React.useState(false);

    const selectedDate = React.useMemo(() => parseIsoDate(value), [value]);

    function handleSelect(date?: Date) {
        onChange(toIsoDate(date));
        setOpen(false);
    }

    function handleClear() {
        onChange("");
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="relative w-full">
                <PopoverTrigger className={"w-full"}>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal bg-transparent hover:bg-transparent",
                            !selectedDate && "text-muted-foreground",
                            className,
                        )}
                    >
                        <CalendarIcon className="mr-2 size-4 shrink-0" />

                        <span className="flex-1 truncate">
                            {selectedDate
                                ? format(selectedDate, "dd.MM.yyyy", {
                                      locale: de,
                                  })
                                : placeholder}
                        </span>
                    </Button>
                </PopoverTrigger>

                {clearable && selectedDate && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                        onClick={handleClear}
                    >
                        <XIcon className="size-4" />
                    </button>
                )}
            </div>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    locale={de}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear() + 5}
                    fromDate={minDate}
                    toDate={maxDate}
                    className="rounded-lg border"
                />
            </PopoverContent>
        </Popover>
    );
}
