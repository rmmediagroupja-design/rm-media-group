import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const page = await (prisma as any).page.findUnique({
            where: { id },
            include: {
                blocks: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
    }
}

// Update Page and fully sync its Blocks
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Use a transaction to ensure all blocks are saved safely
        const updatedPage = await prisma.$transaction(async (tx) => {
            // 1. Update core page details
            await (tx as any).page.update({
                where: { id },
                data: {
                    title: body.title,
                    description: body.description,
                }
            });

            // 2. Wipe existing blocks for this page to replace them cleanly
            await (tx as any).pageBlock.deleteMany({
                where: { pageId: id }
            });

            // 3. Insert new blocks mapped to the correct page, maintaining order
            if (body.blocks && Array.isArray(body.blocks)) {
                await (tx as any).pageBlock.createMany({
                    data: body.blocks.map((b: any, index: number) => ({
                        pageId: id,
                        type: b.type,
                        order: index, // Enforce vertical ordering
                        content: b.content || {}
                    }))
                });
            }

            // Return the fresh state
            return await (tx as any).page.findUnique({
                where: { id },
                include: { blocks: { orderBy: { order: 'asc' } } }
            });
        });

        return NextResponse.json(updatedPage);
    } catch (error) {
        console.error("[UPDATE_PAGE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await (prisma as any).page.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }
}
