import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
    const quote = await prisma.quote.findUnique({
        where: { id: params.id },
        include: { lead: true, client: { include: { user: true } } },
    });

    if (!quote) return <div className="text-white p-8">Quote not found</div>;

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-3xl font-bold text-white">Quote Details</h1>
            <div className="card-luxury p-6">
                <p className="text-[#666]"><strong>Amount:</strong> ${quote.totalAmount.toString()}</p>
                <p className="text-[#666]"><strong>Status:</strong> {quote.status}</p>
                {quote.client && <p className="text-[#666]"><strong>Client:</strong> {quote.client.user?.name}</p>}
                {quote.lead && <p className="text-[#666]"><strong>Lead:</strong> {quote.lead.name}</p>}
            </div>
            <Link href="/admin/quotes" className="btn-cyan text-xs py-2.5 px-5">← Back to Quotes</Link>
        </div>
    );
}
