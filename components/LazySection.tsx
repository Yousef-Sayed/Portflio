"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

interface LazySectionProps {
    children: ReactNode;
    minHeight?: string;
    rootMargin?: string;
    threshold?: number;
}

export function LazySection({
    children,
    minHeight = "400px",
    rootMargin = "200px",
    threshold = 0
}: LazySectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { rootMargin, threshold });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible, rootMargin, threshold]);

    return (
        <div ref={ref} style={{ minHeight: !isVisible ? minHeight : undefined }}>
            {isVisible ? children : null}
        </div>
    );
}
