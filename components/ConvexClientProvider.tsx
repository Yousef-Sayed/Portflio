"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Create client on server side too for SSR
  const client = convexUrl ? new ConvexReactClient(convexUrl) : null;

  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
