import { prisma } from "@/lib/prisma";

// ─── Booking Service ──────────────────────────────────────────────────────────

export async function getBookings(filters?: { clientId?: string; status?: string }) {
    return prisma.booking.findMany({
        where: {
            ...(filters?.clientId && { clientId: filters.clientId }),
            ...(filters?.status && { status: filters.status as any }),
        },
        include: { client: { include: { user: true } }, project: true },
        orderBy: { shootDate: "asc" },
    });
}

export async function getBookingById(id: string) {
    return prisma.booking.findUnique({
        where: { id },
        include: { client: { include: { user: true } }, project: true },
    });
}

export async function checkDoubleBooking(
    shootDate: Date,
    shootEndDate?: Date,
    excludeId?: string
): Promise<boolean> {
    const end = shootEndDate ?? new Date(shootDate.getTime() + 8 * 60 * 60 * 1000); // default 8h window

    const conflict = await prisma.booking.findFirst({
        where: {
            id: excludeId ? { not: excludeId } : undefined,
            status: { notIn: ["CANCELLED"] },
            OR: [
                // New booking starts during an existing one
                { shootDate: { lte: shootDate }, shootEndDate: { gte: shootDate } },
                // New booking ends during an existing one
                { shootDate: { lte: end }, shootEndDate: { gte: end } },
                // New booking completely contains an existing one
                { shootDate: { gte: shootDate }, shootEndDate: { lte: end } },
            ],
        },
    });

    return !!conflict;
}

export async function createBooking(data: {
    clientId: string;
    projectId?: string;
    title: string;
    description?: string;
    serviceType: string;
    shootDate: string;
    shootEndDate?: string;
    location?: string;
    depositPaid?: boolean;
    depositAmount?: number;
    totalAmount?: number;
    notes?: string;
}) {
    const shootDate = new Date(data.shootDate);
    const shootEndDate = data.shootEndDate ? new Date(data.shootEndDate) : undefined;

    const hasConflict = await checkDoubleBooking(shootDate, shootEndDate);
    if (hasConflict) {
        throw new Error("Double booking detected: another booking exists in this time slot.");
    }

    return prisma.booking.create({
        data: {
            clientId: data.clientId,
            projectId: data.projectId,
            title: data.title,
            description: data.description,
            serviceType: data.serviceType as any,
            shootDate,
            shootEndDate,
            location: data.location,
            depositPaid: data.depositPaid ?? false,
            depositAmount: data.depositAmount,
            totalAmount: data.totalAmount,
            notes: data.notes,
        },
        include: { client: { include: { user: true } } },
    });
}

export async function updateBookingStatus(id: string, status: string) {
    return prisma.booking.update({ where: { id }, data: { status: status as any } });
}

export async function getUpcomingBookings(limit = 5) {
    return prisma.booking.findMany({
        where: {
            shootDate: { gte: new Date() },
            status: { notIn: ["CANCELLED", "COMPLETED"] },
        },
        include: { client: { include: { user: true } } },
        orderBy: { shootDate: "asc" },
        take: limit,
    });
}
