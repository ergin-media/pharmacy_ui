"use client";

import * as React from "react";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group";

type NumberInputProps = {
    value: number;
    unit?: string;
    disabled?: boolean;
    onChange: (value: number) => void;
};

export function NumberInput(props: NumberInputProps) {
    const { value, unit, disabled, onChange } = props;

    const [internal, setInternal] = React.useState(String(value));

    React.useEffect(() => {
        setInternal(String(value));
    }, [value]);

    return (
        <InputGroup>
            <InputGroupInput
                inputMode="numeric"
                value={internal}
                disabled={disabled}
                className="text-right"
                onChange={(e) => {
                    if (disabled) return;

                    const v = e.target.value;
                    setInternal(v);

                    const parsed = Number(v);

                    if (!Number.isNaN(parsed)) {
                        onChange(parsed);
                    }
                }}
            />

            {unit && (
                <InputGroupAddon align="inline-end">
                    <InputGroupText>{unit}</InputGroupText>
                </InputGroupAddon>
            )}
        </InputGroup>
    );
}
