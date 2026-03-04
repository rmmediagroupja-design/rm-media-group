import { prisma } from "@/lib/prisma";
import { formatDate, formatRelative, leadStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", "NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "LOST"];

export default async function LeadsPage({ searchParams }: { searchParams: { status?: string } }) {
    const status = searchParams.status && searchParams.status !== "ALL" ? searchParams.status : undefined;

    const leads = await prisma.lead.findMany({
        where: status ? { status: status as any } : undefined,
        include: { notes: true, client: true },
        orderBy: { createdAt: "desc" },
    });

    // Count per status for pipeline summary
    const counts = await prisma.lead.groupBy({
        by: ["status"],
        _count: { _all: true },
    });

    const countMap: Record<string, number> = {};
    counts.forEach((c) => { countMap[c.status] = c._count._all; });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Lead Management
                    </h1>
                    <p className="text-[#666] text-sm mt-1">{leads.length} leads {status ? `with status: ${status}` : "total"}</p>
                </div>
            </div>

            {/* Pipeline summary */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {STATUSES.filter(s => s !== "ALL").map((s) => (
                    <Link
                        key={s}
                        href={`/admin/leads?status=${s}`}
                        className={`card-luxury p-4 text-center transition-all cursor-pointer ${status === s ? "border-[#00D2B9]/50" : ""}`}
                    >
                        <div className="text-2xl font-bold text-white mb-1">{countMap[s] ?? 0}</div>
                        <div className="text-[#666] text-xs">{s}</div>
                    </Link>
                ))}
            </div>

            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                    <Link
                        key={s}
                        href={`/admin/leads${s === "ALL" ? "" : `?status=${s}`}`}
                        className={`px-3 py-1.5 rounded-sm text-xs font-medium tracking-wide border transition-all ${(s === "ALL" && !status) || s === status
                                ? "bg-[#00D2B9]/20 text-[#00D2B9] border-[#00D2B9]/30"
                                : "bg-transparent text-[#666] border-[#252525] hover:border-[#444]"
                            }`}
                    >
                        {s}
                    </Link>
                ))}
            </div>

            {/* Leads table */}
            <div className="card-luxury overflow-hidden">
                <table className="table-luxury">
                    <thead>
                        <tr>
                            <th>Contact</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Budget</th>
                            <th>Event Date</th>
                            <th>Received</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-[#666] py-12">No leads found.</td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="text-white text-sm font-medium">{lead.name}</div>
                                        <div className="text-[#666] text-xs">{lead.email}</div>
                                        {lead.phone && <div className="text-[#666] text-xs">{lead.phone}</div>}
                                    </td>
                                    <td className="text-[#a0a0a0] text-xs">{lead.serviceInterest ?? "—"}</td>
                                    <td>
                                        <span className={`badge ${leadStatusColor[lead.status]}`}>{lead.status}</span>
                                    </td>
                                    <td className="text-[#a0a0a0] text-sm">
                                        {lead.budget ? `$${lead.budget.toLocaleString()}` : "—"}
                                    </td>
                                    <td className="text-[#666] text-xs">
                                        {lead.eventDate ? formatDate(lead.eventDate) : "—"}
                                    </td>
                                    <td className="text-[#666] text-xs">{formatRelative(lead.createdAt)}</td>
                                    <td>
                                        <Link
                                            href={`/admin/leads/${lead.id}`}
                                            className="text-[#00D2B9] text-xs hover:underline"
                                        >
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
