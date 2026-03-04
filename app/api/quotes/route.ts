import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getQuotes, createQuote } from "@/lib/services/quoteService";
import { z } from "zod";

const quoteItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().min(0.01),
    unitPrice: z.number().min(0),
});

const createQuoteSchema = z.object({
    clientId: z.string(),
    title: z.string().min(2),
    description: z.string().optional(),
    taxRate: z.number().min(0).max(100).optional(),
    discount: z.number().min(0).optional(),
    validUntil: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(quoteItemSchema).min(1),
});

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const quotes = await getQuotes(status);
    return NextResponse.json(quotes);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const parsed = createQuoteSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }
        const quote = await createQuote(parsed.data);
        return NextResponse.json(quote, { status: 201 });
    } catch (error) {
        console.error("[CREATE_QUOTE]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
