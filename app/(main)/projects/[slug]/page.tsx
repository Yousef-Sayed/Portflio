import { portfolioData } from "@/data/portfolio-data";
import { Metadata } from "next";
import ProjectContent from "./ProjectContent";

// SSG: Pre-render all project pages
export async function generateStaticParams() {
    const slugs = new Set<string>();
    // Collect slugs from all languages (though they usually match)
    Object.values(portfolioData).forEach(langData => {
        langData.projects.forEach(p => {
            if (p.slug) slugs.add(p.slug);
        });
    });
    return Array.from(slugs).map(slug => ({ slug }));
}

// SEO: Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    // Default to English for metadata if possible
    const project = portfolioData.en.projects.find(p => p.slug === slug)
        || portfolioData.ar.projects.find(p => p.slug === slug);

    if (!project) return { title: "Project Not Found | Yousef Abdrabboh" };

    return {
        title: `${project.title} | Yousef Abdrabboh`,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: [project.image],
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ProjectContent slug={slug} />;
}
