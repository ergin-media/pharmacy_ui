import { useLocation } from "react-router";
import { getBreadcrumbsForPath } from "@/shared/nav/nav.breadcrumbs";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumb() {
    const { pathname } = useLocation();
    const crumbs = getBreadcrumbsForPath(pathname);

    if (!crumbs.length) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((c, idx) => {
                    const isLast = idx === crumbs.length - 1;

                    return (
                        <>
                            <BreadcrumbItem key={c.to}>
                                {isLast ? (
                                    <BreadcrumbPage>{c.title}</BreadcrumbPage>
                                ) : (
                                    // Wenn BreadcrumbLink NUR href kann: href={c.to}
                                    // Wenn es render kann (wie SheetTrigger): render={<Link to={c.to}>{c.title}</Link>}
                                    <BreadcrumbLink href={c.to}>
                                        {c.title}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast ? <BreadcrumbSeparator /> : null}
                        </>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
