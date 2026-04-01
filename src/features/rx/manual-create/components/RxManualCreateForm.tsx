import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { RxManualCreateFormValues } from "../types/rx-manual-create.types";
import { RxManualCreateItemsTable } from "./RxManualCreateItemsTable";

export function RxManualCreateForm(props: {
    values: RxManualCreateFormValues;
    onChange: <K extends keyof RxManualCreateFormValues>(
        key: K,
        value: RxManualCreateFormValues[K],
    ) => void;
    onItemChange: (
        itemId: number,
        patch: Partial<RxManualCreateFormValues["items"][number]>,
    ) => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: number) => void;
}) {
    const { values, onChange, onItemChange, onAddItem, onRemoveItem } = props;

    return (
        <div className="grid gap-4">
            <Card>
                <CardContent className="grid gap-4 px-0 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Rezeptdatum</Label>
                        <DatePicker
                            value={values.issueDate}
                            onChange={(value) => onChange("issueDate", value)}
                            placeholder="Rezeptdatum wählen"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="gap-3">
                <CardHeader className="px-0">
                    <CardTitle>Patientendaten</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="manual-rx-patient-first-name">
                                Vorname
                            </Label>
                            <Input
                                id="manual-rx-patient-first-name"
                                value={values.patientFirstName}
                                onChange={(e) =>
                                    onChange("patientFirstName", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="manual-rx-patient-last-name">
                                Nachname
                            </Label>
                            <Input
                                id="manual-rx-patient-last-name"
                                value={values.patientLastName}
                                onChange={(e) =>
                                    onChange("patientLastName", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="manual-rx-patient-street">Straße</Label>
                        <Input
                            id="manual-rx-patient-street"
                            value={values.patientStreet}
                            onChange={(e) =>
                                onChange("patientStreet", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                        <div className="grid gap-2">
                            <Label htmlFor="manual-rx-patient-zip">PLZ</Label>
                            <Input
                                id="manual-rx-patient-zip"
                                value={values.patientZip}
                                onChange={(e) =>
                                    onChange("patientZip", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="manual-rx-patient-city">Ort</Label>
                            <Input
                                id="manual-rx-patient-city"
                                value={values.patientCity}
                                onChange={(e) =>
                                    onChange("patientCity", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="gap-3">
                <CardHeader className="px-0">
                    <CardTitle>Artikel</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <RxManualCreateItemsTable
                        items={values.items}
                        onItemChange={onItemChange}
                        onAddItem={onAddItem}
                        onRemoveItem={onRemoveItem}
                    />
                </CardContent>
            </Card>

            <Card className="gap-3">
                <CardContent className="px-0">
                    <div className="grid gap-2">
                        <Label htmlFor="manual-rx-notes">
                            Hinweise - Nur für interne Zwecke
                        </Label>
                        <Textarea
                            id="manual-rx-notes"
                            value={values.notes}
                            placeholder="Optionale Hinweise zum Rezept"
                            onChange={(e) => onChange("notes", e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}