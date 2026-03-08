// src/features/dashboard/components/DashboardDailyActivityCard.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardRevenueDailyBarChart } from "./DashboardRevenueDailyBarChart";
import { DashboardOrdersDailyBarChart } from "./DashboardOrdersDailyBarChart";
import type {
} from "./DashboardRevenueDailyBarChart";
import type { DashboardOrdersDailyPointDto, DashboardRevenueDailyDto } from "../types/dashboard.dto";

export function DashboardDailyActivityCard(props: {
    rangeLabel: string;
    revenueDaily: DashboardRevenueDailyDto[];
    ordersDaily: DashboardOrdersDailyPointDto[];
}) {
    const { rangeLabel, revenueDaily, ordersDaily } = props;

    const [tab, setTab] = useState<"revenue" | "orders">("revenue");

    return (
        <div className="rounded-lg bg-white p-4">
            <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as "revenue" | "orders")}
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-medium">
                            Tagesentwicklung
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Zeitraum: {rangeLabel}
                        </div>
                    </div>

                    <TabsList>
                        <TabsTrigger value="revenue">Umsätze</TabsTrigger>
                        <TabsTrigger value="orders">Bestellungen</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="revenue" className="mt-0">
                    {revenueDaily.length > 0 ? (
                        <DashboardRevenueDailyBarChart
                            data={revenueDaily}
                            rangeLabel={rangeLabel}
                            title="Umsatz pro Tag"
                            withCard={false}
                            withHeader={false}
                        />
                    ) : (
                        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                            Noch keine Umsatzdaten verfügbar.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                    {ordersDaily.length > 0 ? (
                        <DashboardOrdersDailyBarChart
                            data={ordersDaily}
                            rangeLabel={rangeLabel}
                            title="Bestellungen pro Tag"
                            withCard={false}
                            withHeader={false}
                        />
                    ) : (
                        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                            Noch keine Bestelldaten verfügbar.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}