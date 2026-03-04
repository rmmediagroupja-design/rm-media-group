import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateSiteContent, getPageContent } from "@/lib/services/cmsService";
import { z } from "zod";

const contentUpdateSchema = z.object({
    page: z.string(),
    section: z.string(),
    key: z.string(),
    content: z.any(),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page");

        if (!page) {
            return NextResponse.json({ error: "Page parameter is required" }, { status: 400 });
        }

        const content = await getPageContent(page);
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = contentUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }

        const { page, section, key, content } = parsed.data;
        const result = await updateSiteContent(page, section, key, content);
        return NextResponse.json(result);
    } catch (error) {
        console.error("[CMS_CONTENT_UPDATE]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
