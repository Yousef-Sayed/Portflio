"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DynamicTitle() {
    const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;
    
    const storedSiteName = useQuery(api.messages.getSetting, { key: "site_name" });
    const storedTagline = useQuery(api.messages.getSetting, { key: "site_tagline" });
    
    useEffect(() => {
        if (!hasConvex) return;
        
        const siteName = storedSiteName || "YTech Solutions";
        const tagline = storedTagline || "Professional Web Development";
        
        // Update document title when Convex values change
        if (storedSiteName !== undefined || storedTagline !== undefined) {
            document.title = `${siteName} | ${tagline}`;
        }
    }, [hasConvex, storedSiteName, storedTagline]);
    
    return null; // This component doesn't render anything visible
}
