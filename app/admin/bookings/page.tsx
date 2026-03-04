import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, bookingStatusColor } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default async function BookingsPage({ searchParams }: { searchParams: { status?: string } }) {
    const status = searchParams.status && searchParams.status !== "ALL" ? searchParams.status : undefined;

    const bookings = await prisma.booking.findMany({
        where: status ? { status: status as any } : undefined,
        include: { client: { include: { user: true } }, project: true },
        orderBy: { shootDate: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Bookings
                    </h1>
                    <p className="text-[#666] text-sm mt-1">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/admin/bookings/new" className="btn-cyan text-xs py-2.5 px-5">
                    + New Booking
                </Link>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                    <Link
                        key={s}
                        href={`/admin/bookings${s === "ALL" ? "" : `?status=${s}`}`}
                        className={`px-3 py-1.5 rounded-sm text-xs font-medium tracking-wide border transition-all ${(s === "ALL" && !status) || s === status
                                ? "bg-[#00D2B9]/20 text-[#00D2B9] border-[#00D2B9]/30"
                                : "bg-transparent text-[#666] border-[#252525] hover:border-[#444]"
                            }`}
                    >
                        {s}
                    </Link>
                ))}
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="table-luxury">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Title</th>
                            <th>Service</th>
                            <th>Shoot Date</th>
                            <th>Location</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-[#666] py-12">No bookings found.</td></tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b.id}>
                                    <td>
                                        <div className="text-white text-sm font-medium">{b.client.user.name}</div>
                                        <div className="text-[#666] text-xs">{b.client.user.email}</div>
                                    </td>
                                    <td className="text-[#a0a0a0] text-sm">{b.title}</td>
                                    <td className="text-[#666] text-xs">{b.serviceType}</td>
                                    <td className="text-[#a0a0a0] text-sm">
                                        <div>{formatDate(b.shootDate)}</div>
                                        {b.shootEndDate && (
                                            <div className="text-[#666] text-xs">→ {formatDate(b.shootEndDate)}</div>
                                        )}
                                    </td>
                                    <td className="text-[#666] text-xs">{b.location ?? "—"}</td>
                                    <td className="text-white text-sm">
                                        {b.totalAmount ? formatCurrency(b.totalAmount) : "—"}
                                    </td>
                                    <td>
                                        <span className={`badge ${bookingStatusColor[b.status]}`}>{b.status}</span>
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
