import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(1),
    clientId: z.string().uuid(),
    password: z.string().optional(),
    allowDownload: z.boolean().optional(),
    expiresAt: z.string().datetime().optional(),
});

export async function GET() {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const galleries = await prisma.gallery.findMany({
        include: {
            client: { include: { user: true } },
            _count: { select: { files: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(galleries);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const gallery = await prisma.gallery.create({
        data: {
            name: parsed.data.name,
            clientId: parsed.data.clientId,
            password: parsed.data.password ?? null,
            allowDownload: parsed.data.allowDownload ?? true,
            expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        },
    });

    return NextResponse.json(gallery, { status: 201 });
}
