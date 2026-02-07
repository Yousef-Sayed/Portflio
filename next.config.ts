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
    // Optimize package imports for smaller bundles
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Server-only packages (native/WASM modules)
  serverExternalPackages: ["mupdf"],

  // Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Security headers
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
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)",
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
    ];
  },

  // Redirect www to non-www (optional, adjust based on your domain)
  async redirects() {
    return [];
  },
};

export default nextConfig;
