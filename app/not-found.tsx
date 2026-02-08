"use client";

import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

const translations = {
  en: {
    headline: "Oops! The page you are looking for does not exist.",
    description: "It seems you have ventured into uncharted territory. Let us get you back on track!",
    primaryCTA: "Back to Home",
  },
  ar: {
    headline: "عذراً، الصفحة التي تحاول الوصول إليها غير موجودة",
    description: "يبدو أنك تعرّضت إلى منطقة غير مستكشفة. دعنا نعيدك إلى المسار الصحيح!",
    primaryCTA: "العودة إلى الصفحة الرئيسية",
  },
};

export default function NotFound() {
  const t = translations.en;

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-background"
      dir="ltr"
    >
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="relative w-[min(90vw,800px)] h-[min(90vw,800px)] opacity-[0.04] dark:opacity-[0.06]">
          <Image
            src="/my-image.svg"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-[100px]"
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-tr from-accent/10 to-accent/5 blur-[100px]"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-[80px] animate-spin-slow"
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center animate-fade-in">
        <div className="relative mb-8 sm:mb-12">
          <div className="absolute inset-0 blur-3xl opacity-20">
            <div className="w-full h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full" />
          </div>
          <h1
            className="not-found-title relative text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-none bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{ textShadow: "0 0 80px hsl(var(--primary) / 0.3)" }}
          >
            404
          </h1>
        </div>

        <div className="space-y-4 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t.headline}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-[52px] sm:min-h-[48px] px-8 rounded-2xl font-semibold text-sm bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{t.primaryCTA}</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }

        .not-found-title {
          background-size: 200% auto;
          animation: gradient-x 4s ease infinite;
        }

        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-gradient-x,
          .animate-spin-slow,
          .animate-fade-in,
          .not-found-title {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
