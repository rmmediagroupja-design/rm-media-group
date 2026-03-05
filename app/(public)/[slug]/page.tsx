import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata dynamically from the page description
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug },
        select: { title: true, description: true }
    });

    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
    };
}

export default async function DynamicPublicPage({ params }: PageProps) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug },
        include: {
            blocks: {
                orderBy: { order: "asc" }
            }
        }
    });

    if (!page) {
        notFound();
    }

    return (
        <main>
            <BlockRenderer blocks={page.blocks} />
        </main>
    );
}

// Ensure the page is dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;
