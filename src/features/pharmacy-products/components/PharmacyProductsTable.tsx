import type { PharmacyProductDto } from "../types/pharmacy-products.dto";

function formatEurFromCents(cents: number) {
    const v = (cents / 100).toFixed(2).replace(".", ",");
    return `${v} €`;
}

export function PharmacyProductsTable(props: {
    items: PharmacyProductDto[];
    isLoading?: boolean;
}) {
    const { items, isLoading } = props;

    if (!items.length && !isLoading) {
        return (
            <div className="text-sm text-muted-foreground">
                Keine Produkte gefunden.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                    <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                        <th>ID</th>
                        <th>Hersteller</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Status</th>
                        <th>Basispreis</th>
                        <th>Preis (andere)</th>
                        <th>Erstellt</th>
                    </tr>
                </thead>

                <tbody className="[&>tr]:border-t">
                    {items.map((p) => (
                        <tr key={p.id} className="[&>td]:px-3 [&>td]:py-2">
                            <td className="text-muted-foreground">{p.id}</td>
                            <td>{p.manufacturer ?? "-"}</td>
                            <td className="font-medium">{p.name}</td>
                            <td className="text-muted-foreground">
                                {p.product_code}
                            </td>
                            <td>
                                {p.is_active ? (
                                    <span className="text-emerald-700">
                                        Aktiv
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">
                                        Inaktiv
                                    </span>
                                )}
                            </td>
                            <td>
                                {formatEurFromCents(p.prices.base_price_cents)}
                            </td>
                            <td>
                                {formatEurFromCents(
                                    p.prices.price_other_provider_cents,
                                )}
                            </td>
                            <td className="text-muted-foreground">
                                {p.created_at}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
