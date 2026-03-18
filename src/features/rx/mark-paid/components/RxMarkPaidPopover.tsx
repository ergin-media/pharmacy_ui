import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useRxMarkPaid } from "../ hooks/useRxMarkPaid";

export function RxMarkPaidPopover(props: {
    rxId: number;
    disabled?: boolean;
    triggerLabel?: string;
}) {
    const {
        rxId,
        disabled = false,
        triggerLabel = "Zahlung bestätigen",
    } = props;

    const [open, setOpen] = useState(false);
    const vm = useRxMarkPaid(rxId);

    async function handleSubmit() {
        await vm.actions.submit();
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button type="button" size="sm" disabled={disabled}>
                    {triggerLabel}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-96 p-4">
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <div className="text-sm font-medium">
                            Zahlung bestätigen
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Bitte bestätige das Zahlungsdatum.
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Zahlungsdatum</Label>
                        <DatePicker
                            value={vm.paidAt}
                            onChange={vm.actions.setPaidAt}
                            placeholder="Zahlungsdatum wählen"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={vm.isPending}
                            onClick={() => setOpen(false)}
                        >
                            Abbrechen
                        </Button>

                        <LoadingButton
                            type="button"
                            onClick={handleSubmit}
                            loading={vm.isPending}
                            disabled={!vm.paidAt || vm.isPending}
                        >
                            Speichern
                        </LoadingButton>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
