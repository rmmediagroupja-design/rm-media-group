import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInvoices, createInvoice } from "@/lib/services/invoiceService";
import { z } from "zod";

const invoiceItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().min(0.01),
    unitPrice: z.number().min(0),
});

const createInvoiceSchema = z.object({
    clientId: z.string(),
    projectId: z.string().optional(),
    title: z.string().min(2),
    description: z.string().optional(),
    taxRate: z.number().min(0).max(100).optional(),
    discount: z.number().min(0).optional(),
    dueDate: z.string(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1),
});

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const invoices = await getInvoices(status);
    return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const parsed = createInvoiceSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }
        const invoice = await createInvoice(parsed.data);
        return NextResponse.json(invoice, { status: 201 });
    } catch (error) {
        console.error("[CREATE_INVOICE]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
