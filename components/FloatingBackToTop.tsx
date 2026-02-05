"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";

export function FloatingBackToTop() {
    const [isVisible, setIsVisible] = React.useState(false);
    const { scrollY } = useScroll();

    React.useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsVisible(latest > 300);
        });

        return () => unsubscribe();
    }, [scrollY]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <m.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-8 right-8 z-40"
                >
                    <Button
                        onClick={scrollToTop}
                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 flex items-center justify-center transition-all duration-300"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </Button>
                </m.div>
            )}
        </AnimatePresence>
    );
}
