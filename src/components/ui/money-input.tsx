import * as React from "react";

import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupText,
} from "@/components/ui/input-group";

function formatMoneyInput(cents: number) {
    return (cents / 100).toFixed(2);
}

function parseMoneyInput(value: string) {
    const normalized = value.replace(",", ".");
    const amount = Number(normalized);

    if (!Number.isFinite(amount) || amount < 0) return 0;

    return Math.round(amount * 100);
}

export function MoneyInput(props: {
    cents: number;
    currency: string;
    disabled?: boolean;
    onChange: (value: number) => void;
}) {
    const { cents, currency, disabled, onChange } = props;

    const [value, setValue] = React.useState(formatMoneyInput(cents));

    React.useEffect(() => {
        setValue(formatMoneyInput(cents));
    }, [cents]);

    return (
        <InputGroup>
            <InputGroupInput
                inputMode="decimal"
                value={value}
                disabled={disabled}
                className="text-right"
                onChange={(e) => {
                    if (disabled) return;
                    setValue(e.target.value);
                }}
                onBlur={() => {
                    if (disabled) return;

                    const parsed = parseMoneyInput(value);
                    onChange(parsed);
                    setValue(formatMoneyInput(parsed));
                }}
            />

            <InputGroupAddon align="inline-end">
                <InputGroupText>{currency}</InputGroupText>
            </InputGroupAddon>
        </InputGroup>
    );
}
