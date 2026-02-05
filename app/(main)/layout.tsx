"use client";

import { MainLayout } from "@/components/MainLayout";
import { ReactNode } from "react";

export default function MainPageLayout({ children }: { children: ReactNode }) {
    return <MainLayout>{children}</MainLayout>;
}
