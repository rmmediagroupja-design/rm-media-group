import Link from "next/link";
import { ArrowRight, Camera, Video, Share2, Star, ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import { getPageContent, getSiteSettings } from "@/lib/services/cmsService";

export const metadata: Metadata = {
    title: "RM Media Group JA — Photography, Videography & Social Media",
    description:
        "Jamaica's premier visual storytelling agency. Luxury wedding photography, cinematic videography, and social media management.",
};

export const dynamic = "force-dynamic";

// High-quality professional photography (CDN-reliable, no hotlinking restrictions)
const HERO_IMAGE = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=2000&auto=format&fit=crop&q=80";

const SERVICES = [
    {
        icon: Camera,
        title: "Photography",
        desc: "Cinematic photography that captures every emotion — from intimate portraits to grand weddings.",
        href: "/services#photography",
    },
    {
        icon: Video,
        title: "Videography",
        desc: "Award-winning video production that transforms your story into a cinematic masterpiece.",
        href: "/services#videography",
    },
    {
        icon: Share2,
        title: "Social Media",
        desc: "Strategic content creation and management that builds brand presence across all platforms.",
        href: "/services#social",
    },
];

const STATS = [
    { value: "500+", label: "Projects Delivered" },
    { value: "8+", label: "Years of Excellence" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "50+", label: "Luxury Weddings" },
];

const PORTFOLIO_TEASER = [
    { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop&q=80", alt: "Luxury Wedding" },
    { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&auto=format&fit=crop&q=80", alt: "Editorial Portrait" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80", alt: "Wedding Coverage" },
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&auto=format&fit=crop&q=80", alt: "Destination Wedding" },
    { src: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=1200&auto=format&fit=crop&q=80", alt: "Creative Campaigns" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80", alt: "Commercial Shots" },
    { src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&auto=format&fit=crop&q=80", alt: "Event Coverage" },
];

export default async function HomePage() {
    const settings = await getSiteSettings();
    const content = await getPageContent("home");

    const heroTitle = content.hero?.title || "Photography is,Poetry.";
    const heroSubtitle = content.hero?.subtitle || "Jamaica's premier photography, videography, and social media agency — crafting cinematic moments that last a lifetime.";
    const heroImageUrl = content.hero?.imageUrl || HERO_IMAGE;

    return (
        <>
            {/* ─── Hero ─────────────────────────────────────────────────────────── */}
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{
                    background: `url('${heroImageUrl}') center/cover no-repeat`,
                }}
            >
                <div className="hero-overlay absolute inset-0" />

                {/* Floating grain texture */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 mb-8">
                        <div className="h-px w-12 bg-[#00D2B9]" />
                        <span className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium">
                            Visual Storytelling
                        </span>
                        <div className="h-px w-12 bg-[#00D2B9]" />
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-8 text-white tracking-tight"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        {heroTitle.split(',')[0]},
                        <br />
                        <span className="gradient-text-cyan">{heroTitle.split(',')[1] || "Told Beautifully."}</span>
                    </h1>

                    <p className="text-[#a0a0a0] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="btn-cyan">
                            Book a Session
                            <ArrowRight size={16} />
                        </Link>
                        <Link href="/portfolio" className="btn-outline-cyan">
                            View Our Work
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-[#666] text-xs tracking-[0.2em] uppercase">Scroll</span>
                    <ArrowDown size={14} className="text-[#00D2B9]" />
                </div>
            </section>

            {/* ─── Stats Bar ────────────────────────────────────────────────────── */}
            <section className="bg-[#111111] border-y border-[#252525]">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div
                                    className="text-3xl md:text-4xl font-bold gradient-text-cyan mb-2"
                                    style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-[#666] text-xs tracking-[0.1em] uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Services ─────────────────────────────────────────────────────── */}
            <section className="py-32 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-20">
                    <p className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                        What We Do
                    </p>
                    <h2
                        className="text-5xl md:text-6xl font-bold text-white"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Our Services
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SERVICES.map((svc) => (
                        <Link
                            key={svc.title}
                            href={svc.href}
                            className="card-luxury p-10 group cursor-pointer block"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#00D2B9]/10 flex items-center justify-center mb-6 group-hover:bg-[#00D2B9]/20 transition-colors">
                                <svc.icon size={22} className="text-[#00D2B9]" />
                            </div>
                            <h3
                                className="text-2xl font-bold text-white mb-4 group-hover:text-[#00D2B9] transition-colors"
                                style={{ fontFamily: "var(--font-playfair), serif" }}
                            >
                                {svc.title}
                            </h3>
                            <p className="text-[#666] leading-relaxed text-sm mb-6">{svc.desc}</p>
                            <span className="text-[#00D2B9] text-xs tracking-[0.15em] uppercase font-semibold flex items-center gap-2">
                                Learn More <ArrowRight size={12} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Portfolio Preview ─────────────────────────────────────────────── */}
            <section className="py-24 bg-[#0d0d0d]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                        <div>
                            <p className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                                Our Work
                            </p>
                            <h2
                                className="text-5xl md:text-6xl font-bold text-white"
                                style={{ fontFamily: "var(--font-playfair), serif" }}
                            >
                                Featured Projects
                            </h2>
                        </div>
                        <Link href="/portfolio" className="btn-outline-cyan shrink-0">
                            View All Work
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[250px]">
                        {PORTFOLIO_TEASER.map((img, i) => {
                            let spanClass = "col-span-1 row-span-1";
                            if (i === 0) spanClass = "col-span-2 md:col-span-2 row-span-2"; // Large Primary
                            else if (i === 1) spanClass = "col-span-1 md:col-span-1 row-span-2"; // Tall Portrait
                            else if (i === 4) spanClass = "col-span-2 md:col-span-2 row-span-1"; // Wide Landscape

                            return (
                                <div
                                    key={i}
                                    className={`relative overflow-hidden group ${spanClass}`}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                        <span className="text-white text-xs text-center px-4 tracking-[0.15em] uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {img.alt}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Testimonial ──────────────────────────────────────────────────── */}
            <section className="py-32 max-w-4xl mx-auto px-6 text-center">
                <div className="flex justify-center gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-[#00D2B9] fill-[#00D2B9]" />
                    ))}
                </div>
                <blockquote
                    className="text-3xl md:text-4xl font-medium text-white leading-relaxed mb-8"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    "RM Media Group captured our wedding so beautifully — every photo is a masterpiece.
                    We couldn't have asked for anything more."
                </blockquote>
                <div className="text-[#666] text-sm tracking-[0.1em]">
                    — Simone & Marcus Brown, Kingston, Jamaica
                </div>
            </section>

            {/* ─── CTA Banner ───────────────────────────────────────────────────── */}
            <section className="relative py-32 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, #0a0a0a 0%, #1a1510 50%, #0a0a0a 100%)`,
                }}
            >
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: "radial-gradient(circle at 50% 50%, #00D2B9 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <h2
                        className="text-5xl md:text-6xl font-bold text-white mb-6"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Ready to Create
                        <span className="gradient-text-cyan"> Magic?</span>
                    </h2>
                    <p className="text-[#a0a0a0] text-lg mb-10 leading-relaxed">
                        Let's collaborate on your next project. Whether it's a wedding, brand campaign, or
                        social media strategy — we're ready.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="btn-cyan">
                            Book Your Session
                            <ArrowRight size={16} />
                        </Link>
                        <Link href="/contact" className="btn-outline-cyan">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
