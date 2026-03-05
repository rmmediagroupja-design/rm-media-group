import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Image, Lock, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
    const gallery = await prisma.gallery.findUnique({
        where: { id: params.id },
        include: { client: { include: { user: true } }, _count: { select: { files: true } } },
    });

    if (!gallery) return <div className="text-white">Gallery not found</div>;

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-3xl font-bold text-white">{gallery.name}</h1>
            <p className="text-[#666]">{gallery.description}</p>
            <div className="flex items-center gap-4">
                {gallery.password && (
                    <span className="glass text-xs px-2 py-1 rounded text-[#00D2B9] flex items-center gap-1">
                        <Lock size={10} /> Protected
                    </span>
                )}
                {gallery.allowDownload && (
                    <span className="glass text-xs px-2 py-1 rounded text-[#a0a0a0] flex items-center gap-1">
                        <Download size={10} /> DL
                    </span>
                )}
                {gallery.expiresAt && (
                    <span className="text-[#666] text-xs">Expires: {new Date(gallery.expiresAt).toLocaleDateString()}</span>
                )}
            </div>
            <Link href="/admin/galleries" className="btn-cyan text-xs py-2.5 px-5">← Back to Galleries</Link>
        </div>
    );
}
