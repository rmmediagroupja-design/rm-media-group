import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
    try {
        return await prisma.siteSettings.findUnique({
            where: { id: "default" },
        });
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}

export async function updateSiteSettings(data: any) {
    return await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: data,
        create: { id: "default", ...data },
    });
}

export async function getPageContent(page: string) {
    try {
        const contents = await prisma.siteContent.findMany({
            where: { page },
        });

        // Group by section for easier usage in components
        return contents.reduce((acc: any, curr) => {
            if (!acc[curr.section]) {
                acc[curr.section] = {};
            }
            acc[curr.section][curr.key] = curr.content;
            return acc;
        }, {});
    } catch (error) {
        console.error(`Error fetching content for page: ${page}`, error);
        return {};
    }
}

export async function updateSiteContent(page: string, section: string, key: string, content: any) {
    return await prisma.siteContent.upsert({
        where: {
            page_section_key: {
                page,
                section,
                key,
            },
        },
        update: { content },
        create: {
            page,
            section,
            key,
            content,
        },
    });
}

export async function getSiteContent(page: string, section: string, key: string) {
    return await prisma.siteContent.findUnique({
        where: {
            page_section_key: {
                page,
                section,
                key,
            },
        },
    });
}
