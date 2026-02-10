import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        // Allow all HTTPS images for dynamic project images
        protocol: "https",
        hostname: "**",
      },
      {
        // Allow HTTP images (for development/testing)
        protocol: "http",
        hostname: "**",
      },
    ],
    // Enable modern image formats for better compression
    formats: ["image/avif", "image/webp"],
    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable gzip/brotli compression
  compress: true,

  // Production optimizations
  experimental: {
    // Inline CSS to eliminate render-blocking CSS requests
    inlineCss: true,
    // Optimize package imports for smaller bundles
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-label",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-visually-hidden",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },

  // Enable React Compiler for automatic memoization (reduces main thread work)
  // @ts-ignore - The error message indicates this has moved to the root level
  reactCompiler: true,

  // Server-only packages (native/WASM modules)
  serverExternalPackages: ["mupdf"],

  // Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Security headers and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache PDF files
      {
        source: "/(.*)\\.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache HTML pages for better bfcache support
      {
        source: "/:path*(.html)?",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  // Redirect www to non-www (optional, adjust based on your domain)
  async redirects() {
    return [];
  },
};

export default nextConfig;
