"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBackToTop } from "@/components/FloatingBackToTop";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LazyMotion, domAnimation } from "framer-motion";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { DynamicTitle } from "@/components/DynamicTitle";

export function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isNotFoundPage = pathname === "/not-found";

    // Hide navbar and footer on 404 page using data attribute
    useEffect(() => {
        if (isNotFoundPage) {
            // Add data attribute to body to style accordingly
            document.body.setAttribute("data-page", "404");
            
            // Hide any existing nav/header/footer elements immediately
            const elements = document.querySelectorAll('[class*="fixed top-0 left-0 right-0 z-50"]');
            elements.forEach(el => {
                (el as HTMLElement).style.display = "none";
            });
            
            const footers = document.querySelectorAll("footer");
            footers.forEach(el => {
                (el as HTMLElement).style.display = "none";
            });
        }
    }, [isNotFoundPage, pathname]);

    return (
        <LanguageProvider>
            <ThemeProvider defaultTheme="light" storageKey="ytech-theme">
                <LazyMotion features={domAnimation}>
                    {process.env.NEXT_PUBLIC_CONVEX_URL ? (
                        <ConvexClientProvider>
                            <DynamicFavicon />
                            <DynamicTitle />
                            {!isDashboard && !isNotFoundPage && (
                                <Navbar data-hide-on-404 />
                            )}
                            <main data-page-content={isNotFoundPage ? "404" : "normal"}>
                                {children}
                            </main>
                            {!isDashboard && !isNotFoundPage && (
                                <Footer data-hide-on-404 />
                            )}
                            <FloatingBackToTop />
                        </ConvexClientProvider>
                    ) : (
                        <>
                            {!isDashboard && !isNotFoundPage && (
                                <Navbar data-hide-on-404 />
                            )}
                            <main data-page-content={isNotFoundPage ? "404" : "normal"}>
                                {children}
                            </main>
                            {!isDashboard && !isNotFoundPage && (
                                <Footer data-hide-on-404 />
                            )}
                            <FloatingBackToTop />
                        </>
                    )}
                </LazyMotion>
            </ThemeProvider>
        </LanguageProvider>
    );
}
