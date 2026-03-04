"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Calendar, Camera } from "lucide-react";

const schema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(7, "Phone required"),
    serviceType: z.string().min(1, "Please select a service"),
    eventDate: z.string().min(1, "Event date required"),
    eventLocation: z.string().min(2, "Location required"),
    guestCount: z.string().optional(),
    budget: z.string().optional(),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SERVICES = [
    { value: "WEDDING", label: "Wedding Photography & Videography" },
    { value: "PORTRAIT", label: "Portrait Session" },
    { value: "CORPORATE", label: "Corporate / Headshots" },
    { value: "COMMERCIAL", label: "Commercial / Product" },
    { value: "VIDEOGRAPHY", label: "Videography Only" },
    { value: "SOCIAL_MEDIA", label: "Social Media Management" },
    { value: "OTHER", label: "Other / Not sure yet" },
];

const BUDGETS = [
    "Under $500",
    "$500 – $1,000",
    "$1,000 – $2,500",
    "$2,500 – $5,000",
    "$5,000+",
    "Let's discuss",
];

export default function BookPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    source: "booking_form",
                    serviceInterest: data.serviceType,
                    eventDate: data.eventDate,
                    budget: data.budget ? parseFloat(data.budget.replace(/[^0-9.]/g, "")) : undefined,
                    message: `Location: ${data.eventLocation}${data.guestCount ? `. Guests: ${data.guestCount}` : ""}${data.notes ? `. Notes: ${data.notes}` : ""}`,
                }),
            });

            if (!res.ok) throw new Error("Failed");
            setSubmitted(true);
            reset();
        } catch {
            setError("Something went wrong. Please email us directly at info@rmmediagroup.com");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-40 pb-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: "radial-gradient(circle at 50% 50%, #00D2B9 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <Camera size={14} className="text-[#00D2B9]" />
                        <span className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium">
                            Book a Session
                        </span>
                    </div>
                    <h1
                        className="text-6xl md:text-7xl font-bold text-white mb-6"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Let's Make Magic
                    </h1>
                    <p className="text-[#666] text-lg leading-relaxed">
                        Fill out the form below and we'll follow up within 24 hours to confirm availability
                        and discuss the details of your vision.
                    </p>
                </div>
            </section>

            {/* Form */}
            <section className="pb-32 max-w-3xl mx-auto px-6">
                {submitted ? (
                    <div className="card-luxury p-12 text-center">
                        <CheckCircle2 size={56} className="text-[#00D2B9] mx-auto mb-6" />
                        <h2
                            className="text-3xl font-bold text-white mb-4"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                            Booking Request Received!
                        </h2>
                        <p className="text-[#666] max-w-md mx-auto mb-8">
                            Thank you for choosing RM Media Group JA. We'll review your request and be in
                            touch within 24 hours to confirm availability.
                        </p>
                        <button onClick={() => setSubmitted(false)} className="btn-outline-cyan text-xs">
                            Submit Another Request
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="card-luxury p-8 lg:p-10 space-y-8">
                        {/* Contact section */}
                        <div>
                            <h3 className="text-[#00D2B9] text-xs tracking-[0.15em] uppercase font-semibold mb-4">
                                Your Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Full Name *</label>
                                    <input {...register("name")} placeholder="Full name" className="input-luxury" />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Email *</label>
                                    <input {...register("email")} type="email" placeholder="your@email.com" className="input-luxury" />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Phone *</label>
                                    <input {...register("phone")} type="tel" placeholder="+1 (876) 000-0000" className="input-luxury" />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="divider-cyan" />

                        {/* Event details */}
                        <div>
                            <h3 className="text-[#00D2B9] text-xs tracking-[0.15em] uppercase font-semibold mb-4">
                                Event / Session Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Service Type *</label>
                                    <select {...register("serviceType")} className="input-luxury">
                                        <option value="">Select service…</option>
                                        {SERVICES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                        <Calendar size={12} className="inline mr-1" /> Event Date *
                                    </label>
                                    <input {...register("eventDate")} type="date" className="input-luxury" />
                                    {errors.eventDate && <p className="text-red-400 text-xs mt-1">{errors.eventDate.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Location *</label>
                                    <input {...register("eventLocation")} placeholder="Venue / city" className="input-luxury" />
                                    {errors.eventLocation && <p className="text-red-400 text-xs mt-1">{errors.eventLocation.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Guest Count</label>
                                    <input {...register("guestCount")} placeholder="e.g. 150" className="input-luxury" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Budget Range</label>
                                    <select {...register("budget")} className="input-luxury">
                                        <option value="">Select budget…</option>
                                        {BUDGETS.map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Additional Notes</label>
                                    <textarea
                                        {...register("notes")}
                                        rows={4}
                                        placeholder="Tell us more about your vision, specific requests, or questions…"
                                        className="input-luxury resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded p-3">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-cyan w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting…" : "Submit Booking Request"}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                )}
            </section>
        </>
    );
}
