import Link from "next/link";
import { ArrowRight, Award, Heart, Zap } from "lucide-react";
import type { Metadata } from "next";
import { getPageContent } from "@/lib/services/cmsService";

export const metadata: Metadata = {
    title: "About",
    description: "Learn about RM Media Group JA — Jamaica's premier photography, videography, and social media marketing agency.",
};

export const dynamic = "force-dynamic";

const VALUES = [
    {
        icon: Award,
        title: "Excellence",
        desc: "Every project receives our full creative energy and technical precision, no matter the scale.",
    },
    {
        icon: Heart,
        title: "Authenticity",
        desc: "We believe in capturing genuine moments — real emotions, real stories, real connections.",
    },
    {
        icon: Zap,
        title: "Innovation",
        desc: "Constantly evolving our craft with the latest techniques and technology to stay ahead.",
    },
];

// Professional photography — no hotlinking restrictions
const ABOUT_IMAGES = [
    { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&auto=format&fit=crop&q=80", alt: "Editorial Portrait" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Wedding Coverage" },
    { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80", alt: "Luxury Wedding" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80", alt: "Lifestyle Session" },
];

export default async function AboutPage() {
    const content = await getPageContent("about");

    const heroTitle = content.hero?.title || "Behind The Lens";
    const heroSubtitle = content.hero?.subtitle || "Born in Jamaica, built on passion. RM Media Group JA has been telling visual stories that resonate, inspire, and endure since our founding.";
    const heroImageUrl = content.hero?.imageUrl || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=2000&auto=format&fit=crop&q=80";

    const missionTitle = content.mission?.title || "Our Mission";
    const missionText1 = content.mission?.text1 || "At RM Media Group JA, we believe every brand, every couple, and every individual has a unique story worth telling. Our mission is to capture those stories with honesty, artistry, and an unwavering commitment to quality.";
    const missionText2 = content.mission?.text2 || "We've had the privilege of documenting over 500 projects across Jamaica — from intimate family portraits to luxury destination weddings, corporate campaigns to viral social media content.";

    const valuesTitle = content.values_title || "What Drives Us";

    return (
        <>
            {/* Hero */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `url('${heroImageUrl}') center/cover no-repeat`,
                    }}
                />
                <div className="hero-overlay absolute inset-0" />
                <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
                    <p className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium mb-6">Our Story</p>
                    <h1
                        className="text-6xl md:text-8xl font-bold text-white leading-[0.9] mb-8"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        {heroTitle.split(' ').slice(0, -2).join(' ')}
                        <br />
                        <span className="gradient-text-cyan">{heroTitle.split(' ').slice(-2).join(' ')}</span>
                    </h1>
                    <p className="text-[#a0a0a0] text-xl max-w-2xl leading-relaxed">
                        {heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                            {missionTitle}
                        </h2>
                        <p className="text-[#666] leading-relaxed mb-6">
                            {missionText1}
                        </p>
                        <p className="text-[#666] leading-relaxed mb-8">
                            {missionText2}
                        </p>
                        <Link href="/contact" className="btn-cyan">
                            Work With Us <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {ABOUT_IMAGES.map((img, i) => (
                            <img
                                key={i}
                                src={img.src}
                                alt={img.alt}
                                className={`w-full aspect-square object-cover rounded-sm ${i === 1 ? "mt-8" : i === 2 ? "-mt-8" : ""}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-[#0d0d0d]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2
                            className="text-4xl md:text-5xl font-bold text-white"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                            {valuesTitle}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {VALUES.map((v) => (
                            <div key={v.title} className="card-luxury p-8 text-center">
                                <div className="w-14 h-14 rounded-full bg-[#00D2B9]/10 flex items-center justify-center mx-auto mb-6">
                                    <v.icon size={24} className="text-[#00D2B9]" />
                                </div>
                                <h3
                                    className="text-2xl font-bold text-white mb-4"
                                    style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                    {v.title}
                                </h3>
                                <p className="text-[#666] leading-relaxed text-sm">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center max-w-2xl mx-auto px-6">
                <h2
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    Let's Create Together
                </h2>
                <p className="text-[#666] mb-8 leading-relaxed">
                    Whether you're planning a wedding, launching a brand, or building your social media
                    presence — we'd love to be part of your story.
                </p>
                <Link href="/book" className="btn-cyan">
                    Start Your Project <ArrowRight size={16} />
                </Link>
            </section>
        </>
    );
}
