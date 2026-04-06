import { TypographyH1 } from "@/components/ui/typography";
import { useRxOverviewPage } from "../hooks/useRxOverviewPage";
import { RxOverviewPageContent } from "../components/RxOverviewPageContent";

export function RxOverviewPage() {
    const vm = useRxOverviewPage();

    return (
        <div className="h-full w-full">
            <TypographyH1 className="mb-4">Rezeptübersicht</TypographyH1>
            <RxOverviewPageContent vm={vm} />
        </div>
    );
}