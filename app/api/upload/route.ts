import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(request: NextRequest) {
    const session = await auth();

    // Only allow Admins and Staff to securely upload images to Cloudinary
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { paramsToSign } = body;

        if (!paramsToSign) {
            return NextResponse.json({ error: "Missing paramsToSign" }, { status: 400 });
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({ signature });
    } catch (error) {
        console.error("[CLOUDINARY_SIGN]", error);
        return NextResponse.json({ error: "Failed to sign upload request" }, { status: 500 });
    }
}
