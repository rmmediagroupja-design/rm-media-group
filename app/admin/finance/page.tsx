import { prisma } from "@/lib/prisma";
import { getFinancialSummary } from "@/lib/services/invoiceService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
    const [summary, monthlyBreakdown, topClients] = await Promise.all([
        getFinancialSummary(),

        // Monthly revenue breakdown (last 6 months)
        prisma.$queryRaw<{ month: string; revenue: number; count: number }[]>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "paidAt"), 'Mon YYYY') as month,
        COALESCE(SUM(total), 0)::float as revenue,
        COUNT(*)::int as count
      FROM invoices
      WHERE status = 'PAID' 
        AND "paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "paidAt")
      ORDER BY DATE_TRUNC('month', "paidAt") DESC
    `.catch(() => []),

        // Top 5 clients by invoice total
        prisma.client.findMany({
            include: {
                user: true,
                invoices: { where: { status: "PAID" } },
            },
            take: 10,
            orderBy: { createdAt: "desc" },
        }),
    ]);

    // Sort clients by revenue client-side (Prisma doesn't support sum ordering directly without raw)
    const clientsByRevenue = topClients
        .map((c) => ({
            ...c,
            totalRevenue: c.invoices.reduce((sum, inv) => sum + inv.total, 0),
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

    const kpis = [
        { label: "Revenue This Month", value: formatCurrency(summary.monthlyRevenue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Outstanding Balance", value: formatCurrency(summary.outstanding), icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { label: "Marketing MRR", value: formatCurrency(summary.marketingMonthlyRecurring), icon: TrendingUp, color: "text-[#00D2B9]", bg: "bg-[#00D2B9]/10" },
        { label: "All-Time Revenue", value: formatCurrency(summary.totalRevenue), icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    Financial Overview
                </h1>
                <p className="text-[#666] text-sm mt-1">Revenue breakdown and financial health at a glance.</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="kpi-card flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${kpi.bg} flex items-center justify-center shrink-0`}>
                            <kpi.icon size={20} className={kpi.color} />
                        </div>
                        <div>
                            <p className="text-xs text-[#666] tracking-wider mb-1">{kpi.label}</p>
                            <p className="text-xl font-bold text-white">{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Monthly Breakdown */}
                <div className="card-luxury">
                    <div className="px-6 py-4 border-b border-[#252525]">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <Calendar size={16} className="text-[#00D2B9]" />
                            Monthly Revenue (Last 6 Months)
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {(monthlyBreakdown as any[]).length === 0 ? (
                            <p className="text-[#666] text-sm">No paid invoices yet.</p>
                        ) : (
                            (monthlyBreakdown as any[]).map((row: any) => {
                                const maxRevenue = Math.max(...(monthlyBreakdown as any[]).map((r: any) => r.revenue));
                                const pct = maxRevenue > 0 ? (row.revenue / maxRevenue) * 100 : 0;
                                return (
                                    <div key={row.month}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm text-[#a0a0a0]">{row.month}</span>
                                            <div className="text-right">
                                                <span className="text-white text-sm font-medium">{formatCurrency(row.revenue)}</span>
                                                <span className="text-[#666] text-xs ml-2">({row.count} inv.)</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-[#252525] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full gradient-cyan"
                                                style={{ width: `${pct}%`, transition: "width 0.6s ease" }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Top Clients by Revenue */}
                <div className="card-luxury">
                    <div className="px-6 py-4 border-b border-[#252525]">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#00D2B9]" />
                            Top Clients by Revenue
                        </h2>
                    </div>
                    <div className="divide-y divide-[#1e1e1e]">
                        {clientsByRevenue.length === 0 ? (
                            <p className="text-[#666] text-sm p-6">No paid invoices yet.</p>
                        ) : (
                            clientsByRevenue.map((c, i) => (
                                <div key={c.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs text-[#666] font-medium shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-medium truncate">{c.user.name}</div>
                                        <div className="text-[#666] text-xs">{c.invoices.length} paid invoice{c.invoices.length !== 1 ? "s" : ""}</div>
                                    </div>
                                    <div className="text-[#00D2B9] font-semibold text-sm shrink-0">
                                        {formatCurrency(c.totalRevenue)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
