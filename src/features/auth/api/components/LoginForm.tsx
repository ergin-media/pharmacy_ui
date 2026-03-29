"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    onSubmit: (data: { email: string; password: string }) => void;
    isLoading?: boolean;
    error?: string | null;
};

export function LoginForm({ className, onSubmit, isLoading, error }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ email, password });
            }}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Bitte einloggen
                    </p>
                </div>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Field>

                {error && (
                    <div className="text-sm text-destructive">{error}</div>
                )}

                <Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Lade..." : "Login"}
                    </Button>
                </Field>

                <FieldSeparator>Oder</FieldSeparator>

                <Field>
                    <Button variant="outline" type="button">
                        GitHub
                    </Button>
                    <FieldDescription className="text-center">
                        Kein Account vorhanden?
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}