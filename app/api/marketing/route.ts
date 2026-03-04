import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
    businessName: z.string().min(1),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    package: z.enum(["BASIC", "STANDARD", "PREMIUM", "CUSTOM"]).default("STANDARD"),
    monthlyFee: z.number().min(0),
    instagram: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    tiktok: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    notes: z.string().optional(),
});

export async function GET() {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.marketingClient.findMany({
        include: { _count: { select: { content: true } } },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
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

    const client = await prisma.marketingClient.create({
        data: {
            ...parsed.data,
            email: parsed.data.contactEmail || session.user?.email || "unknown@email.com",
            startDate: new Date(),
            user: { connect: { id: session.user?.id } },
            instagram: parsed.data.instagram || null,
            facebook: parsed.data.facebook || null,
            tiktok: parsed.data.tiktok || null,
            youtube: parsed.data.youtube || null,
        },
    });

    return NextResponse.json(client, { status: 201 });
}
