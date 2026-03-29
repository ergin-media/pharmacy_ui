"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "../components/LoginForm";
import { useLoginPage } from "../hooks/useLoginPage";

export function LoginPage() {
    const vm = useLoginPage();

    if (vm.isPageLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <div className="text-sm text-muted-foreground">Lade…</div>
            </div>
        );
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <div className="flex items-center gap-2 font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Pharmacy System
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm
                            onSubmit={vm.actions.submit}
                            isLoading={vm.isSubmitting}
                        />
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-muted lg:block">
                <img
                    src="https://images.pexels.com/photos/29986988/pexels-photo-29986988.jpeg"
                    alt="Login"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}