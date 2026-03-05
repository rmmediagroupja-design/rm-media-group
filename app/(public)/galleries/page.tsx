import Link from "next/link";
import { Image, Lock, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GalleriesPublicPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/galleries`);
    const galleries = await res.json();

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-3xl font-bold text-white">Client Galleries</h1>
            {galleries.length === 0 ? (
                <p className="text-[#666]">No galleries available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {galleries.map((g: any) => (
                        <Link
                            key={g.id}
                            href={`/admin/galleries/${g.id}`}
                            className="card-luxury overflow-hidden group"
                        >
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
                                        {g._count?.files || 0} files
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-semibold text-sm group-hover:text-[#00D2B9] transition-colors truncate">
                                    {g.name}
                                </h3>
                                <p className="text-[#666] text-xs mt-1">{g.client?.user?.name}</p>
                                {g.expiresAt && (
                                    <p className="text-[#666] text-xs mt-0.5">
                                        Expires: {new Date(g.expiresAt).toLocaleDateString()}
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
