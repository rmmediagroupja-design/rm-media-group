import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLeads, createLead, updateLeadStatus, convertLeadToClient } from "@/lib/services/leadService";
import { z } from "zod";

const createLeadSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    serviceInterest: z.string().optional(),
    budget: z.number().optional(),
    eventDate: z.string().optional(),
    message: z.string().optional(),
});

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const leads = await getLeads(status);
    return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createLeadSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }
        const lead = await createLead(parsed.data);
        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error("[CREATE_LEAD]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
