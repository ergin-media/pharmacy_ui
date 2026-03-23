export async function uploadPharmacyProductsCsv(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/v1/pharmacy-products/import`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message ?? "Upload failed");
    }

    return data;
}