import { useState } from "react";
import { uploadPharmacyProductsCsv } from "../api/pharmacy-products-import.api";

export function usePharmacyProductsImport() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    async function handleUpload(nextFile: File) {
        setFile(nextFile);
        setIsUploading(true);

        try {
            const res = await uploadPharmacyProductsCsv(nextFile);

            // erwartung: backend gibt preview zurück
            setPreview(res.preview ?? []);
        } finally {
            setIsUploading(false);
        }
    }

    function reset() {
        setFile(null);
        setPreview([]);
    }

    return {
        file,
        preview,
        isUploading,
        actions: {
            upload: handleUpload,
            reset,
        },
    };
}