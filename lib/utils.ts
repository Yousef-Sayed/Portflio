import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Schedule a callback to run when the browser is idle.
 * Falls back to setTimeout for browsers without requestIdleCallback.
 * 
 * @param callback - Function to run when idle
 * @param timeout - Max wait time in ms before forcing execution
 * @returns Cleanup function to cancel the scheduled callback
 */
export function scheduleIdleCallback(
    callback: () => void,
    timeout: number = 1000
): () => void {
    if (typeof window === 'undefined') {
        // Server-side: execute immediately
        callback();
        return () => { };
    }

    if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(callback, { timeout });
        return () => window.cancelIdleCallback(handle);
    } else {
        const timeoutId = setTimeout(callback, Math.min(timeout, 100));
        return () => clearTimeout(timeoutId);
    }
}

/**
 * Batch DOM reads and writes using requestAnimationFrame to prevent layout thrashing.
 * 
 * @param reads - Function that performs DOM reads (measurements)
 * @param writes - Function that performs DOM writes (mutations)
 */
export function batchedRAF(
    reads: () => unknown,
    writes: (readResults: unknown) => void
): void {
    if (typeof window === 'undefined') return;

    requestAnimationFrame(() => {
        const readResults = reads();
        requestAnimationFrame(() => {
            writes(readResults);
        });
    });
}

/**
 * Create a debounced version of a function.
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with cancel method
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
): T & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debounced = ((...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T & { cancel: () => void };

    debounced.cancel = () => {
        if (timeoutId) clearTimeout(timeoutId);
    };

    return debounced;
}
