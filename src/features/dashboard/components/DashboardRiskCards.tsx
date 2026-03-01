// src/features/dashboard/components/DashboardRiskCards.tsx
import { useNavigate } from "react-router";
import { AlertTriangle, Users, Package, Euro } from "lucide-react";
import { formatEUR, formatInt } from "@/shared/lib/format/figures";

type RiskProps = {
    rx_with_unmapped_items: number;
    rx_with_pricing_base_price_missing: number;
    rx_with_patient_issues: number;
    products_missing_base_price: number;
    revenue_risk_total: number;
};

function RiskCard(props: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    variant?: "warning" | "danger";
    onClick?: () => void;
}) {
    const { title, value, icon, variant = "warning", onClick } = props;

    const border =
        variant === "danger"
            ? "border-destructive/50"
            : "border-amber-500/40";

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:bg-muted/40 ${border}`}
        >
            <div className="mb-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{title}</div>
                {icon}
            </div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
}

export function DashboardRiskCards(props: { risk: RiskProps }) {
    const { risk } = props;
    const navigate = useNavigate();

    return (
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            <RiskCard
                title="Nicht zugeordnete Positionen"
                value={formatInt(risk.rx_with_unmapped_items)}
                icon={<Package className="size-4 text-amber-500" />}
                onClick={() => navigate("/rx?unmapped=1")}
            />

            <RiskCard
                title="Fehlende Preisgrundlage"
                value={formatInt(risk.rx_with_pricing_base_price_missing)}
                icon={<AlertTriangle className="size-4 text-amber-500" />}
                onClick={() => navigate("/rx?pricing_missing=1")}
            />

            <RiskCard
                title="Patientendaten unvollständig"
                value={formatInt(risk.rx_with_patient_issues)}
                icon={<Users className="size-4 text-amber-500" />}
                onClick={() => navigate("/patients?issues=with_issues")}
            />

            <RiskCard
                title="Produkte ohne Basispreis"
                value={formatInt(risk.products_missing_base_price)}
                icon={<Package className="size-4 text-amber-500" />}
                onClick={() => navigate("/products?missing_base_price=1")}
            />

            <RiskCard
                title="Gefährdeter Umsatz"
                value={formatEUR(risk.revenue_risk_total)}
                icon={<Euro className="size-4 text-destructive" />}
                variant="danger"
                onClick={() => navigate("/rx?risk_revenue=1")}
            />
        </div>
    );
}