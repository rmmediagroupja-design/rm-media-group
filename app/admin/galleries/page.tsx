import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Image, Lock, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GalleriesPage() {
    const galleries = await prisma.gallery.findMany({
        include: {
            client: { include: { user: true } },
            _count: { select: { files: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Client Galleries
                    </h1>
                    <p className="text-[#666] text-sm mt-1">{galleries.length} gallerr{galleries.length !== 1 ? "ies" : "y"}</p>
                </div>
                <Link href="/admin/galleries/new" className="btn-cyan text-xs py-2.5 px-5">
                    + New Gallery
                </Link>
            </div>

            {galleries.length === 0 ? (
                <div className="card-luxury p-16 text-center">
                    <Image size={40} className="text-[#444] mx-auto mb-4" />
                    <p className="text-[#666] text-sm">No galleries created yet.</p>
                    <Link href="/admin/galleries/new" className="btn-cyan mt-6 text-xs py-2.5 px-5">
                        Create First Gallery
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {galleries.map((g) => (
                        <Link
                            key={g.id}
                            href={`/admin/galleries/${g.id}`}
                            className="card-luxury overflow-hidden group"
                        >
                            {/* Preview placeholder */}
                            <div className="h-40 bg-[#1a1a1a] relative flex items-center justify-center">
                                <Image size={32} className="text-[#333]" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {g.password && (
                                        <span className="glass text-xs px-2 py-1 rounded text-[#00D2B9] flex items-center gap-1">
                                            <Lock size={10} /> Protected
                                        </span>
                                    )}
                                    {g.allowDownload && (
                                        <span className="glass text-xs px-2 py-1 rounded text-[#a0a0a0] flex items-center gap-1">
                                            <Download size={10} /> DL
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="glass text-[#00D2B9] text-xs px-2 py-1 rounded font-medium">
                                        {g._count.files} files
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-white font-semibold text-sm group-hover:text-[#00D2B9] transition-colors truncate">
                                    {g.name}
                                </h3>
                                <p className="text-[#666] text-xs mt-1">{g.client.user.name}</p>
                                {g.expiresAt && (
                                    <p className="text-[#666] text-xs mt-0.5">
                                        Expires: {formatDate(g.expiresAt)}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
