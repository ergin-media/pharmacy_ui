export function createOfferNumberFromRxId(rxId: number) {
    return `ANG-${String(rxId).padStart(6, "0")}`;
}
