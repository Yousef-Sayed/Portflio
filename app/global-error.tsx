"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Error</h1>
            <p className="text-muted-foreground mb-4">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
