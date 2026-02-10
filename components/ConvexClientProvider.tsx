"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Use state to hold the client instance. We include setClient to allow
  // re-instantiation after bfcache restoration.
  const [client, setClient] = useState<ConvexReactClient | null>(() =>
    convexUrl ? new ConvexReactClient(convexUrl) : null
  );

  // Handle Back/Forward Cache (bfcache)
  // WebSockets prevent bfcache if left open. We must close them on pagehide
  // and ensure a fresh connection on pageshow (if persisted).
  useEffect(() => {
    if (!client) return;

    const handlePageHide = () => {
      try {
        // Explicitly close the WebSocket connection
        // @ts-ignore - 'close' exists on the internal client
        if (typeof client.close === 'function') {
          // @ts-ignore
          client.close();
        }
      } catch (e) {
        // Ignore close errors
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // If the page is restored from bfcache, the old client is closed.
      // We must create a new one to resume functionality.
      if (event.persisted && convexUrl) {
        const newClient = new ConvexReactClient(convexUrl);
        setClient(newClient);
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [client, convexUrl]);

  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
