import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPageSchema = z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
});

export async function GET() {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const pages = await prisma.page.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { blocks: true }
                }
            }
        });
        return NextResponse.json(pages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = createPageSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }

        // Format slug to be URL safe
        const safeSlug = parsed.data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const existing = await prisma.page.findUnique({ where: { slug: safeSlug } });
        if (existing) {
            return NextResponse.json({ error: "Page slug already exists" }, { status: 409 });
        }

        const page = await prisma.page.create({
            data: {
                title: parsed.data.title,
                slug: safeSlug,
            }
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error: any) {
        console.error("[CREATE_PAGE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
