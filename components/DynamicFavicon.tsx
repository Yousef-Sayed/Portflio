"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DynamicFavicon() {
    const storedFavicon = useQuery(api.messages.getSetting, { key: "site_favicon" });
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;

    React.useEffect(() => {
        if (hasConvex && storedFavicon) {
            // Update main favicon
            const updateFaviconLink = (rel: string) => {
                let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
                if (!link) {
                    link = document.createElement("link");
                    link.rel = rel;
                    document.head.appendChild(link);
                }
                link.href = storedFavicon;
            };

            // Update all favicon variants
            updateFaviconLink("icon");
            updateFaviconLink("shortcut icon");
            updateFaviconLink("apple-touch-icon");
        }
    }, [storedFavicon, hasConvex]);

    return null;
}
