import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/services/cmsService";
import { z } from "zod";

const settingsSchema = z.object({
    siteName: z.string().nullish(),
    contactEmail: z.string().nullish(),
    contactPhone: z.string().nullish(),
    address: z.string().nullish(),
    logoUrl: z.string().nullish(),
    faviconUrl: z.string().nullish(),
    instagram: z.string().nullish(),
    facebook: z.string().nullish(),
    youtube: z.string().nullish(),
});

export async function GET() {
    try {
        const settings = await getSiteSettings();
        return NextResponse.json(settings ?? {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = settingsSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
        }

        const settings = await updateSiteSettings(parsed.data);
        return NextResponse.json(settings);
    } catch (error) {
        console.error("[CMS_SETTINGS_UPDATE]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
