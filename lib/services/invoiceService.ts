import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber, calculateTotals } from "@/lib/utils";

// ─── Invoice Service ──────────────────────────────────────────────────────────

export async function getInvoices(status?: string) {
    return prisma.invoice.findMany({
        where: status ? { status: status as any } : undefined,
        include: { client: { include: { user: true } }, items: true, quote: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getInvoiceById(id: string) {
    return prisma.invoice.findUnique({
        where: { id },
        include: {
            client: { include: { user: true } },
            items: true,
            quote: true,
            project: true,
        },
    });
}

export async function createInvoice(data: {
    clientId: string;
    projectId?: string;
    title: string;
    description?: string;
    taxRate?: number;
    discount?: number;
    dueDate: string;
    notes?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
}) {
    const { subtotal, tax, total } = calculateTotals(
        data.items,
        data.taxRate ?? 0,
        data.discount ?? 0
    );

    return prisma.invoice.create({
        data: {
            invoiceNumber: generateInvoiceNumber(),
            clientId: data.clientId,
            projectId: data.projectId,
            title: data.title,
            description: data.description,
            taxRate: data.taxRate ?? 0,
            discount: data.discount ?? 0,
            subtotal,
            tax,
            total,
            dueDate: new Date(data.dueDate),
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

export async function markInvoicePaid(id: string, amountPaid?: number) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new Error("Invoice not found");

    const paid = amountPaid ?? invoice.total;
    const status = paid >= invoice.total ? "PAID" : "PARTIAL";

    return prisma.invoice.update({
        where: { id },
        data: {
            status: status as any,
            amountPaid: paid,
            paidAt: status === "PAID" ? new Date() : undefined,
        },
    });
}

export async function checkOverdueInvoices() {
    return prisma.invoice.updateMany({
        where: {
            status: { in: ["UNPAID", "PARTIAL"] },
            dueDate: { lt: new Date() },
        },
        data: { status: "OVERDUE" },
    });
}

export async function getFinancialSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [monthlyRevenue, outstanding, overdueCount, marketingRevenue, totalRevenue] =
        await Promise.all([
            // Revenue this month
            prisma.invoice.aggregate({
                where: {
                    status: "PAID",
                    paidAt: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { total: true },
            }),
            // Total outstanding (unpaid + partial)
            prisma.invoice.aggregate({
                where: { status: { in: ["UNPAID", "PARTIAL", "OVERDUE"] } },
                _sum: { total: true },
            }),
            // Overdue count
            prisma.invoice.count({ where: { status: "OVERDUE" } }),
            // Marketing recurring revenue (active clients)
            prisma.marketingClient.aggregate({
                where: { active: true },
                _sum: { monthlyFee: true },
            }),
            // Total paid, all time
            prisma.invoice.aggregate({
                where: { status: "PAID" },
                _sum: { total: true },
            }),
        ]);

    return {
        monthlyRevenue: monthlyRevenue._sum.total ?? 0,
        outstanding: outstanding._sum.total ?? 0,
        overdueCount,
        marketingMonthlyRecurring: marketingRevenue._sum.monthlyFee ?? 0,
        totalRevenue: totalRevenue._sum.total ?? 0,
    };
}
