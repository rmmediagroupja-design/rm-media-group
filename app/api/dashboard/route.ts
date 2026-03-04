import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFinancialSummary } from "@/lib/services/invoiceService";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [summary, newLeadsCount, upcomingBookingsCount, activeMarketingClients] = await Promise.all([
        getFinancialSummary(),
        prisma.lead.count({ where: { status: "NEW" } }),
        prisma.booking.count({
            where: {
                shootDate: { gte: new Date() },
                status: { notIn: ["CANCELLED", "COMPLETED"] },
            },
        }),
        prisma.marketingClient.count({ where: { active: true } }),
    ]);

    return NextResponse.json({
        ...summary,
        newLeadsCount,
        upcomingBookingsCount,
        activeMarketingClients,
    });
}
