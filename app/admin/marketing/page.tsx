import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const PACKAGE_COLORS: Record<string, string> = {
    BASIC: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    STANDARD: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PREMIUM: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    CUSTOM: "bg-[#00D2B9]/20 text-[#00D2B9] border-[#00D2B9]/30",
};

export default async function MarketingPage() {
    const clients = await prisma.marketingClient.findMany({
        include: {
            _count: { select: { content: true } },
            content: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
    });

    const activeCount = clients.filter((c) => c.active).length;
    const totalMRR = clients.filter((c) => c.active).reduce((sum, c) => sum + c.monthlyFee, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Social Media Clients
                    </h1>
                    <p className="text-[#666] text-sm mt-1">
                        {activeCount} active · {formatCurrency(totalMRR)}/mo MRR
                    </p>
                </div>
                <Link href="/admin/marketing/new" className="btn-cyan text-xs py-2.5 px-5">
                    + Add Client
                </Link>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="kpi-card flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center">
                        <Users size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs text-[#666] uppercase tracking-wider mb-0.5">Active Clients</p>
                        <p className="text-2xl font-bold text-white">{activeCount}</p>
                    </div>
                </div>
                <div className="kpi-card flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00D2B9]/10 flex items-center justify-center">
                        <TrendingUp size={18} className="text-[#00D2B9]" />
                    </div>
                    <div>
                        <p className="text-xs text-[#666] uppercase tracking-wider mb-0.5">Monthly MRR</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(totalMRR)}</p>
                    </div>
                </div>
            </div>

            {/* Client cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {clients.map((client) => (
                    <Link
                        key={client.id}
                        href={`/admin/marketing/${client.id}`}
                        className="card-luxury p-5 group"
                    >
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h3 className="text-white font-semibold group-hover:text-[#00D2B9] transition-colors">
                                    {client.businessName}
                                </h3>
                                {client.contactName && (
                                    <p className="text-[#666] text-xs mt-0.5">{client.contactName}</p>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className={`badge ${PACKAGE_COLORS[client.package]}`}>
                                    {client.package}
                                </span>
                                <span className={`text-xs font-medium ${client.active ? "text-emerald-400" : "text-[#666]"}`}>
                                    {client.active ? "● Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-[#00D2B9] font-semibold text-sm">
                                {formatCurrency(client.monthlyFee)}<span className="text-[#666] font-normal text-xs">/mo</span>
                            </div>
                            <div className="text-[#666] text-xs">
                                {client._count.content} piece{client._count.content !== 1 ? "s" : ""} of content
                            </div>
                        </div>

                        {/* Platforms */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {[
                                { key: "instagram", label: "IG" },
                                { key: "facebook", label: "FB" },
                                { key: "tiktok", label: "TT" },
                                { key: "youtube", label: "YT" },
                            ].filter((p) => (client as any)[p.key]).map((p) => (
                                <span key={p.key} className="text-[#666] text-[0.65rem] tracking-wider bg-[#252525] px-2 py-0.5 rounded-sm">
                                    {p.label}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
