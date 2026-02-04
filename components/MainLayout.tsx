"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LazyMotion, domAnimation } from "framer-motion";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { DynamicTitle } from "@/components/DynamicTitle";

export function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <LanguageProvider>
            <ThemeProvider defaultTheme="light" storageKey="ytech-theme">
                <LazyMotion features={domAnimation}>
                    {process.env.NEXT_PUBLIC_CONVEX_URL ? (
                        <ConvexClientProvider>
                            <DynamicFavicon />
                            <DynamicTitle />
                            {!isDashboard && <Navbar />}
                            {children}
                            {!isDashboard && <Footer />}
                        </ConvexClientProvider>
                    ) : (
                        <>
                            {!isDashboard && <Navbar />}
                            {children}
                            {!isDashboard && <Footer />}
                        </>
                    )}
                </LazyMotion>
            </ThemeProvider>
        </LanguageProvider>
    );
}
