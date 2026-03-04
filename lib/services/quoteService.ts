import { prisma } from "@/lib/prisma";
import { generateQuoteNumber, generateInvoiceNumber, calculateTotals } from "@/lib/utils";

// ─── Quote Service ────────────────────────────────────────────────────────────

export async function getQuotes(status?: string) {
    return prisma.quote.findMany({
        where: status ? { status: status as any } : undefined,
        include: { client: { include: { user: true } }, items: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getQuoteById(id: string) {
    return prisma.quote.findUnique({
        where: { id },
        include: { client: { include: { user: true } }, items: true, invoice: true },
    });
}

export async function createQuote(data: {
    clientId: string;
    title: string;
    description?: string;
    taxRate?: number;
    discount?: number;
    validUntil?: string;
    notes?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
}) {
    const { subtotal, tax, total } = calculateTotals(
        data.items,
        data.taxRate ?? 0,
        data.discount ?? 0
    );

    return prisma.quote.create({
        data: {
            quoteNumber: generateQuoteNumber(),
            clientId: data.clientId,
            title: data.title,
            description: data.description,
            taxRate: data.taxRate ?? 0,
            discount: data.discount ?? 0,
            subtotal,
            tax,
            total,
            validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
            notes: data.notes,
            items: {
                create: data.items.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.quantity * item.unitPrice,
                })),
            },
        },
        include: { items: true, client: { include: { user: true } } },
    });
}

export async function sendQuote(id: string) {
    return prisma.quote.update({
        where: { id },
        data: { status: "SENT", sentAt: new Date() },
    });
}

export async function approveQuote(id: string) {
    const quote = await prisma.quote.findUnique({
        where: { id },
        include: { items: true, client: true },
    });
    if (!quote) throw new Error("Quote not found");

    // Auto-convert to invoice inside a transaction
    return prisma.$transaction(async (tx) => {
        const updated = await tx.quote.update({
            where: { id },
            data: { status: "APPROVED", approvedAt: new Date() },
        });

        // Create invoice from this quote
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        await tx.invoice.create({
            data: {
                invoiceNumber: generateInvoiceNumber(),
                clientId: quote.clientId,
                quoteId: quote.id,
                title: quote.title,
                description: quote.description,
                taxRate: quote.taxRate,
                discount: quote.discount,
                subtotal: quote.subtotal,
                tax: quote.tax,
                total: quote.total,
                dueDate,
                items: {
                    create: quote.items.map((item) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total,
                    })),
                },
            },
        });

        return updated;
    });
}

export async function rejectQuote(id: string) {
    return prisma.quote.update({
        where: { id },
        data: { status: "REJECTED", rejectedAt: new Date() },
    });
}
