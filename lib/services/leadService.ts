import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/utils";

// ─── Lead Service ──────────────────────────────────────────────────────────────

export async function getLeads(status?: string) {
    return prisma.lead.findMany({
        where: status ? { status: status as any } : undefined,
        include: { notes: { orderBy: { createdAt: "desc" } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function getLeadById(id: string) {
    return prisma.lead.findUnique({
        where: { id },
        include: { notes: { orderBy: { createdAt: "desc" } }, client: { include: { user: true } } },
    });
}

export async function createLead(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    serviceInterest?: string;
    budget?: number;
    eventDate?: string;
    message?: string;
}) {
    return prisma.lead.create({
        data: {
            ...data,
            eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
            serviceInterest: data.serviceInterest as any,
        },
    });
}

export async function updateLeadStatus(id: string, status: string) {
    return prisma.lead.update({ where: { id }, data: { status: status as any } });
}

export async function addLeadNote(leadId: string, content: string) {
    return prisma.leadNote.create({ data: { leadId, content } });
}

export async function convertLeadToClient(leadId: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new Error("Lead not found");
    if (lead.clientId) throw new Error("Lead already converted");

    // Create user + client in transaction
    const result = await prisma.$transaction(async (tx) => {
        const bcrypt = await import("bcryptjs");
        const tempPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        const user = await tx.user.create({
            data: {
                name: lead.name,
                email: lead.email,
                password: hashedPassword,
                role: "CLIENT",
                client: {
                    create: {
                        phone: lead.phone,
                        company: lead.company,
                    },
                },
            },
            include: { client: true },
        });

        await tx.lead.update({
            where: { id: leadId },
            data: {
                clientId: user.client!.id,
                status: "BOOKED",
                convertedAt: new Date(),
            },
        });

        return { user, tempPassword };
    });

    return result;
}
