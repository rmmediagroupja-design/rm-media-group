import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, quoteStatusColor } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", "DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"];

export default async function QuotesPage({ searchParams }: { searchParams: { status?: string } }) {
    const status = searchParams.status && searchParams.status !== "ALL" ? searchParams.status : undefined;

    const quotes = await prisma.quote.findMany({
        where: status ? { status: status as any } : undefined,
        include: { client: { include: { user: true } }, items: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Quotes
                    </h1>
                    <p className="text-[#666] text-sm mt-1">{quotes.length} quote{quotes.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/admin/quotes/new" className="btn-cyan text-xs py-2.5 px-5">
                    + New Quote
                </Link>
            </div>

            <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                    <Link key={s} href={`/admin/quotes${s === "ALL" ? "" : `?status=${s}`}`}
                        className={`px-3 py-1.5 rounded-sm text-xs font-medium tracking-wide border transition-all ${(s === "ALL" && !status) || s === status
                                ? "bg-[#00D2B9]/20 text-[#00D2B9] border-[#00D2B9]/30"
                                : "bg-transparent text-[#666] border-[#252525] hover:border-[#444]"
                            }`}
                    >{s}</Link>
                ))}
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="table-luxury">
                    <thead>
                        <tr>
                            <th>Quote #</th>
                            <th>Client</th>
                            <th>Title</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Valid Until</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.length === 0 ? (
                            <tr><td colSpan={8} className="text-center text-[#666] py-12">No quotes found.</td></tr>
                        ) : (
                            quotes.map((q) => (
                                <tr key={q.id}>
                                    <td className="font-mono text-[#00D2B9] text-xs">{q.quoteNumber}</td>
                                    <td className="text-white text-sm">{q.client.user.name}</td>
                                    <td className="text-[#a0a0a0] text-sm max-w-[160px] truncate">{q.title}</td>
                                    <td className="text-[#666] text-xs">{q.items.length} item{q.items.length !== 1 ? "s" : ""}</td>
                                    <td className="text-white text-sm font-medium">{formatCurrency(q.total)}</td>
                                    <td className="text-[#666] text-xs">{q.validUntil ? formatDate(q.validUntil) : "—"}</td>
                                    <td><span className={`badge ${quoteStatusColor[q.status]}`}>{q.status}</span></td>
                                    <td>
                                        <Link href={`/admin/quotes/${q.id}`} className="text-[#00D2B9] text-xs hover:underline">View →</Link>
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
