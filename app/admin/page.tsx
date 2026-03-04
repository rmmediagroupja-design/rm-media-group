import { prisma } from "@/lib/prisma";
import { getFinancialSummary } from "@/lib/services/invoiceService";
import {
    DollarSign, Users, Calendar, FileText, TrendingUp, AlertCircle,
    Clock, CheckCircle2
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
    const [summary, leads, upcomingBookings, recentInvoices, activeMarketing] = await Promise.all([
        getFinancialSummary(),
        prisma.lead.findMany({ where: { status: "NEW" }, take: 5, orderBy: { createdAt: "desc" } }),
        prisma.booking.findMany({
            where: { shootDate: { gte: new Date() }, status: { notIn: ["CANCELLED", "COMPLETED"] } },
            include: { client: { include: { user: true } } },
            orderBy: { shootDate: "asc" },
            take: 5,
        }),
        prisma.invoice.findMany({
            where: { status: { in: ["UNPAID", "OVERDUE"] } },
            include: { client: { include: { user: true } } },
            orderBy: { dueDate: "asc" },
            take: 5,
        }),
        prisma.marketingClient.count({ where: { active: true } }),
    ]);

    const kpis = [
        {
            label: "Monthly Revenue",
            value: formatCurrency(summary.monthlyRevenue),
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            sub: "This month",
        },
        {
            label: "Outstanding",
            value: formatCurrency(summary.outstanding),
            icon: AlertCircle,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            sub: `${summary.overdueCount} overdue`,
        },
        {
            label: "New Leads",
            value: String(leads.length),
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            sub: "Awaiting contact",
        },
        {
            label: "Upcoming Shoots",
            value: String(upcomingBookings.length),
            icon: Calendar,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            sub: "Confirmed bookings",
        },
        {
            label: "Marketing MRR",
            value: formatCurrency(summary.marketingMonthlyRecurring),
            icon: TrendingUp,
            color: "text-[#00D2B9]",
            bg: "bg-[#00D2B9]/10",
            sub: `${activeMarketing} active clients`,
        },
        {
            label: "Total Revenue",
            value: formatCurrency(summary.totalRevenue),
            icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-400/10",
            sub: "All time",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    Dashboard Overview
                </h1>
                <p className="text-[#666] text-sm mt-1">Welcome back. Here's what's happening today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="kpi-card flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${kpi.bg} flex items-center justify-center shrink-0`}>
                            <kpi.icon size={20} className={kpi.color} />
                        </div>
                        <div>
                            <p className="text-xs text-[#666] tracking-[0.08em] uppercase mb-1">{kpi.label}</p>
                            <p className="text-2xl font-bold text-white">{kpi.value}</p>
                            <p className="text-xs text-[#666] mt-0.5">{kpi.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two-column detail tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Recent New Leads */}
                <div className="card-luxury">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#252525]">
                        <h2 className="text-base font-semibold text-white">New Leads</h2>
                        <Link href="/admin/leads" className="text-[#00D2B9] text-xs hover:underline">View all →</Link>
                    </div>
                    {leads.length === 0 ? (
                        <p className="text-[#666] text-sm px-6 py-6">No new leads.</p>
                    ) : (
                        <table className="table-luxury">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>
                                            <Link href={`/admin/leads/${lead.id}`} className="text-white hover:text-[#00D2B9] font-medium text-sm">
                                                {lead.name}
                                            </Link>
                                            <div className="text-[#666] text-xs">{lead.email}</div>
                                        </td>
                                        <td className="text-[#a0a0a0] text-xs">{lead.serviceInterest ?? "—"}</td>
                                        <td className="text-[#666] text-xs">{formatDate(lead.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Upcoming Bookings */}
                <div className="card-luxury">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#252525]">
                        <h2 className="text-base font-semibold text-white">Upcoming Bookings</h2>
                        <Link href="/admin/bookings" className="text-[#00D2B9] text-xs hover:underline">View all →</Link>
                    </div>
                    {upcomingBookings.length === 0 ? (
                        <p className="text-[#666] text-sm px-6 py-6">No upcoming bookings.</p>
                    ) : (
                        <table className="table-luxury">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>
                                            <div className="text-white text-sm font-medium">{booking.client.user.name}</div>
                                            <div className="text-[#666] text-xs truncate max-w-[140px]">{booking.title}</div>
                                        </td>
                                        <td className="text-[#a0a0a0] text-xs">{booking.serviceType}</td>
                                        <td className="text-[#666] text-xs">{formatDate(booking.shootDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pending Invoices */}
                <div className="card-luxury xl:col-span-2">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#252525]">
                        <h2 className="text-base font-semibold text-white">Pending Invoices</h2>
                        <Link href="/admin/invoices" className="text-[#00D2B9] text-xs hover:underline">View all →</Link>
                    </div>
                    {recentInvoices.length === 0 ? (
                        <p className="text-[#666] text-sm px-6 py-6">No pending invoices. 🎉</p>
                    ) : (
                        <table className="table-luxury">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Client</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentInvoices.map((inv) => (
                                    <tr key={inv.id}>
                                        <td>
                                            <Link href={`/admin/invoices/${inv.id}`} className="text-[#00D2B9] text-sm font-mono hover:underline">
                                                {inv.invoiceNumber}
                                            </Link>
                                        </td>
                                        <td className="text-white text-sm">{inv.client.user.name}</td>
                                        <td className="text-white text-sm font-medium">{formatCurrency(inv.total)}</td>
                                        <td className="text-[#666] text-xs">{formatDate(inv.dueDate)}</td>
                                        <td>
                                            <span className={`badge ${inv.status === "OVERDUE"
                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
