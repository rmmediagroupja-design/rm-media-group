"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    serviceInterest: z.string().optional(),
    budget: z.number().optional(),
    eventDate: z.string().optional(),
    message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewLeadForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    // If eventDate is provided, convert to ISO
                    ...(data.eventDate && { eventDate: new Date(data.eventDate).toISOString() }),
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to create lead");
            }

            router.push("/admin/leads");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        New Lead
                    </h1>
                    <p className="text-[#666] text-sm mt-1">Manually enter a prospective client.</p>
                </div>
                <Link href="/admin/leads" className="btn-secondary text-xs">
                    Cancel
                </Link>
            </div>

            <div className="card-luxury p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Name</label>
                            <input
                                {...register("name")}
                                placeholder="Client name"
                                className="input-luxury w-full"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Email</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="client@example.com"
                                className="input-luxury w-full"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Phone</label>
                            <input
                                {...register("phone")}
                                placeholder="Optional"
                                className="input-luxury w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Company</label>
                            <input
                                {...register("company")}
                                placeholder="Optional"
                                className="input-luxury w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Interest</label>
                            <input
                                {...register("serviceInterest")}
                                placeholder="e.g. Wedding Photo"
                                className="input-luxury w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Date</label>
                            <input
                                type="date"
                                {...register("eventDate")}
                                className="input-luxury w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Budget</label>
                            <input
                                type="number"
                                {...register("budget", { valueAsNumber: true })}
                                placeholder="$0"
                                className="input-luxury w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Message or Notes</label>
                        <textarea
                            {...register("message")}
                            rows={4}
                            placeholder="Initial inquiry details..."
                            className="input-luxury w-full min-h-[100px]"
                        />
                    </div>

                    <div className="pt-4 border-t border-[#222] flex justify-end">
                        <button type="submit" disabled={loading} className="btn-cyan min-w-[150px] justify-center">
                            {loading ? "Creating..." : "Create Lead"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
