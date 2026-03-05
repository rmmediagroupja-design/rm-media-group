"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // using next/navigation in App Router
import { useRouter as useAppRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const schema = z.object({
    clientId: z.string().min(1, "Client is required"),
    title: z.string().min(2, "Title must be at least 2 characters"),
    serviceType: z.enum(["PHOTOGRAPHY", "VIDEOGRAPHY", "SOCIAL_MEDIA", "DESIGN"]),
    shootDate: z.string().min(1, "Shoot date is required"),
    location: z.string().optional(),
    totalAmount: z.number().optional(),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewBookingForm({ clients = [] }: { clients?: any[] }) {
    const router = useAppRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    shootDate: new Date(data.shootDate).toISOString(),
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to create booking");
            }

            router.push("/admin/bookings");
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
                        New Booking
                    </h1>
                    <p className="text-[#666] text-sm mt-1">Schedule a new shoot or project.</p>
                </div>
                <Link href="/admin/bookings" className="btn-secondary text-xs">
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
                    {/* Client Selection (Input for now if clients array isn't passed, ideally a select) */}
                    <div>
                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Client ID</label>
                        <input
                            {...register("clientId")}
                            placeholder="Enter Client ID (or email if backend supports it)"
                            className="input-luxury w-full"
                        />
                        {errors.clientId && <p className="text-red-400 text-xs mt-1">{errors.clientId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Project Title</label>
                        <input
                            {...register("title")}
                            placeholder="e.g. Smith Wedding"
                            className="input-luxury w-full"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Service Type</label>
                            <select {...register("serviceType")} className="input-luxury w-full bg-[#111]">
                                <option value="PHOTOGRAPHY">Photography</option>
                                <option value="VIDEOGRAPHY">Videography</option>
                                <option value="SOCIAL_MEDIA">Social Media</option>
                                <option value="DESIGN">Design</option>
                            </select>
                            {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Shoot Date</label>
                            <input
                                type="datetime-local"
                                {...register("shootDate")}
                                className="input-luxury w-full"
                            />
                            {errors.shootDate && <p className="text-red-400 text-xs mt-1">{errors.shootDate.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Location</label>
                            <input
                                {...register("location")}
                                placeholder="e.g. Kingston"
                                className="input-luxury w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("totalAmount", { valueAsNumber: true })}
                                placeholder="0.00"
                                className="input-luxury w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Notes</label>
                        <textarea
                            {...register("notes")}
                            rows={4}
                            placeholder="Any special requirements..."
                            className="input-luxury w-full min-h-[100px]"
                        />
                    </div>

                    <div className="pt-4 border-t border-[#222] flex justify-end">
                        <button type="submit" disabled={loading} className="btn-cyan min-w-[150px] justify-center">
                            {loading ? "Creating..." : "Create Booking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
