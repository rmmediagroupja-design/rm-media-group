import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarketingDetailPage({ params }: { params: { id: string } }) {
    const client = await prisma.marketingClient.findUnique({
        where: { id: params.id },
        include: { content: true },
    });

    if (!client) return <div className="text-white">Client not found</div>;

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-3xl font-bold text-white">{client.businessName}</h1>
            <p className="text-[#666]">{client.contactName}</p>
            <p className="text-[#666]">{client.email}</p>
            <p className="text-[#666]">{client.phone}</p>
            <div className="flex gap-4 mt-4">
                <span className={`badge ${client.package}`}>{client.package}</span>
                <span className={client.active ? "text-emerald-400" : "text-[#666]"}>
                    {client.active ? "● Active" : "Inactive"}
                </span>
            </div>
            <Link href="/admin/marketing" className="btn-cyan text-xs py-2.5 px-5">← Back to Marketing</Link>
        </div>
    );
}
