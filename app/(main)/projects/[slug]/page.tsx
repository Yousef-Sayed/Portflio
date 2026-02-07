import { portfolioData } from "@/data/portfolio-data";
import { Metadata } from "next";
import ProjectContent from "./ProjectContent";

const siteUrl = "https://portflio-new-iota.vercel.app/";
const siteName = "YTech Solutions";

// SSG: Pre-render all project pages
export async function generateStaticParams() {
    const slugs = new Set<string>();
    Object.values(portfolioData).forEach(langData => {
        langData.projects.forEach(p => {
            if (p.slug) slugs.add(p.slug);
        });
    });
    return Array.from(slugs).map(slug => ({ slug }));
}

// SEO: Enhanced Dynamic Metadata for projects
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = portfolioData.en.projects.find(p => p.slug === slug)
        || portfolioData.ar.projects.find(p => p.slug === slug);

    if (!project) {
        return {
            title: "Project Not Found",
            description: "The requested project could not be found.",
            robots: { index: false, follow: false },
        };
    }

    const projectUrl = `${siteUrl}projects/${slug}`;
    const ogImage = project.image || `${siteUrl}og-image.png`;

    return {
        title: `${project.title} | Projects by ${siteName}`,
        description: project.description,
        keywords: project.tags,
        authors: [{ name: "Youssef Sayed" }],
        creator: "YTech Solutions",
        publisher: siteName,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
            },
        },
        openGraph: {
            type: "website",
            locale: "en_US",
            alternateLocale: ["ar_EG"],
            url: projectUrl,
            siteName: siteName,
            title: `${project.title} | ${siteName} Projects`,
            description: project.description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                    type: "image/png",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@ytechsolutions",
            creator: "@ytechsolutions",
            title: `${project.title} | ${siteName} Projects`,
            description: project.description,
            images: [ogImage],
        },
        facebook: {
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
        },
        other: {
            "og:image:width": "1200",
            "og:image:height": "630",
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ProjectContent slug={slug} />;
}
