import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, invoiceStatusColor } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", "UNPAID", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"];

export default async function InvoicesPage({ searchParams }: { searchParams: { status?: string } }) {
    const status = searchParams.status && searchParams.status !== "ALL" ? searchParams.status : undefined;

    const invoices = await prisma.invoice.findMany({
        where: status ? { status: status as any } : undefined,
        include: { client: { include: { user: true } }, project: true },
        orderBy: { createdAt: "desc" },
    });

    const totalUnpaid = invoices
        .filter((i) => ["UNPAID", "PARTIAL", "OVERDUE"].includes(i.status))
        .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Invoices
                    </h1>
                    <p className="text-[#666] text-sm mt-1">
                        {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
                        {!status && totalUnpaid > 0 && (
                            <span className="ml-2 text-yellow-400"> · {formatCurrency(totalUnpaid)} outstanding</span>
                        )}
                    </p>
                </div>
                <Link href="/admin/invoices/new" className="btn-cyan text-xs py-2.5 px-5">
                    + New Invoice
                </Link>
            </div>

            <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                    <Link key={s} href={`/admin/invoices${s === "ALL" ? "" : `?status=${s}`}`}
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
                            <th>Invoice #</th>
                            <th>Client</th>
                            <th>Title</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr><td colSpan={8} className="text-center text-[#666] py-12">No invoices found.</td></tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td className="font-mono text-[#00D2B9] text-xs">{inv.invoiceNumber}</td>
                                    <td className="text-white text-sm">{inv.client.user.name}</td>
                                    <td className="text-[#a0a0a0] text-sm max-w-[140px] truncate">{inv.title}</td>
                                    <td className="text-white text-sm font-medium">{formatCurrency(inv.total)}</td>
                                    <td className="text-sm">
                                        {inv.amountPaid > 0 ? (
                                            <span className="text-emerald-400">{formatCurrency(inv.amountPaid)}</span>
                                        ) : (
                                            <span className="text-[#666]">—</span>
                                        )}
                                    </td>
                                    <td className={`text-xs ${inv.status === "OVERDUE" ? "text-red-400" : "text-[#666]"}`}>
                                        {formatDate(inv.dueDate)}
                                    </td>
                                    <td><span className={`badge ${invoiceStatusColor[inv.status]}`}>{inv.status}</span></td>
                                    <td>
                                        <Link href={`/admin/invoices/${inv.id}`} className="text-[#00D2B9] text-xs hover:underline">View →</Link>
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
