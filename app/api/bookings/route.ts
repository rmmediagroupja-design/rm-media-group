import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBookings, createBooking } from "@/lib/services/bookingService";
import { z } from "zod";

const createBookingSchema = z.object({
    clientId: z.string(),
    projectId: z.string().optional(),
    title: z.string().min(2),
    description: z.string().optional(),
    serviceType: z.string(),
    shootDate: z.string(),
    shootEndDate: z.string().optional(),
    location: z.string().optional(),
    depositPaid: z.boolean().optional(),
    depositAmount: z.number().optional(),
    totalAmount: z.number().optional(),
    notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const bookings = await getBookings({ clientId, status });
    return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = createBookingSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }
        const booking = await createBooking(parsed.data);
        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        if (error.message?.includes("Double booking")) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        console.error("[CREATE_BOOKING]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
