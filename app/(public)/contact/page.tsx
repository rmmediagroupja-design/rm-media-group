"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const SERVICE_OPTIONS = [
    "Wedding Photography",
    "Portrait Photography",
    "Corporate Photography",
    "Videography",
    "Social Media Management",
    "Commercial Photography",
    "Other",
];

export default function ContactPage() {
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
                    ...data,
                    source: "contact_form",
                    serviceInterest: data.service?.toUpperCase().replace(/ /g, "_"),
                }),
            });

            if (!res.ok) throw new Error("Failed to submit");
            setSubmitted(true);
            reset();
        } catch {
            setError("Something went wrong. Please try again or email us directly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <section className="pt-40 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <p className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                        Get In Touch
                    </p>
                    <h1
                        className="text-6xl md:text-7xl font-bold text-white"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Contact Us
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                    {/* Contact info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2
                                className="text-2xl font-bold text-white mb-6"
                                style={{ fontFamily: "var(--font-playfair), serif" }}
                            >
                                Let's Create Something Beautiful
                            </h2>
                            <p className="text-[#666] leading-relaxed">
                                Ready to tell your story? Reach out and we'll get back to you within 24 hours
                                to discuss your vision.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: "Email", value: "info@rmmediagroup.com" },
                                { icon: Phone, label: "Phone", value: "+1 (876) 000-0000" },
                                { icon: MapPin, label: "Location", value: "Kingston, Jamaica" },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#00D2B9]/10 flex items-center justify-center shrink-0">
                                        <Icon size={16} className="text-[#00D2B9]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#666] tracking-[0.1em] uppercase mb-1">{label}</div>
                                        <div className="text-white text-sm">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3 card-luxury p-8 lg:p-10">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <CheckCircle2 size={48} className="text-[#00D2B9] mb-6" />
                                <h3
                                    className="text-2xl font-bold text-white mb-3"
                                    style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                    Message Received!
                                </h3>
                                <p className="text-[#666] max-w-sm">
                                    Thank you for reaching out. We'll be in touch within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 btn-outline-cyan text-xs"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            {...register("name")}
                                            placeholder="Your name"
                                            className="input-luxury"
                                        />
                                        {errors.name && (
                                            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                            Email *
                                        </label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            placeholder="your@email.com"
                                            className="input-luxury"
                                        />
                                        {errors.email && (
                                            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                            Phone
                                        </label>
                                        <input
                                            {...register("phone")}
                                            type="tel"
                                            placeholder="+1 (876) 000-0000"
                                            className="input-luxury"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                            Service
                                        </label>
                                        <select {...register("service")} className="input-luxury">
                                            <option value="">Select a service</option>
                                            {SERVICE_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        {...register("message")}
                                        rows={5}
                                        placeholder="Tell us about your project, event date, location..."
                                        className="input-luxury resize-none"
                                    />
                                    {errors.message && (
                                        <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                                    )}
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded p-3">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-cyan w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending…" : "Send Message"}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
