import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { RxManualCreateFormValues } from "../types/rx-manual-create.types";

export function RxManualCreatePatientSection(props: {
    values: RxManualCreateFormValues;
    onChange: <K extends keyof RxManualCreateFormValues>(
        key: K,
        value: RxManualCreateFormValues[K],
    ) => void;
}) {
    const { values, onChange } = props;

    return (
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

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="manual-rx-patient-email">E-Mail</Label>
                        <Input
                            id="manual-rx-patient-email"
                            type="email"
                            value={values.patientEmail}
                            onChange={(e) =>
                                onChange("patientEmail", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="manual-rx-patient-phone">Telefon</Label>
                        <Input
                            id="manual-rx-patient-phone"
                            type="tel"
                            value={values.patientPhone}
                            onChange={(e) =>
                                onChange("patientPhone", e.target.value)
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
    );
}
