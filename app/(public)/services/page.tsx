import Link from "next/link";
import { Camera, Video, Share2, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { getPageContent } from "@/lib/services/cmsService";

export const metadata: Metadata = {
    title: "Services",
    description:
        "Photography, videography, and social media marketing services by RM Media Group JA — Jamaica's premier visual agency.",
};

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, any> = {
    Camera: Camera,
    Video: Video,
    Share2: Share2,
};

const DEFAULT_SERVICES = [
    {
        id: "photography",
        icon: "Camera",
        title: "Photography",
        tagline: "Moments Turned Into Art",
        description:
            "From intimate portraits to grand celebrations, our photography captures authentic emotion with cinematic precision. Every assignment is approached with a fresh creative eye and unwavering attention to detail.",
        features: [
            "Wedding & Engagement Photography",
            "Portrait & Headshot Sessions",
            "Corporate & Event Photography",
            "Commercial & Product Photography",
            "Lifestyle & Brand Photography",
            "Fine Art Prints Available",
        ],
        image: "https://images-pw.pixieset.com/site/gley00/RmZpkj/DSCF3720_ec08a69b_2048.jpg",
        price: "Starting from $500",
    },
    {
        id: "videography",
        icon: "Video",
        title: "Videography",
        tagline: "Stories That Move",
        description:
            "Our cinematic video production team transforms your event into a timeless film. Using Hollywood-grade equipment and expert storytelling techniques, we create videos that captivate and inspire.",
        features: [
            "Wedding Films (Full Ceremony + Highlight Reel)",
            "Corporate & Brand Videos",
            "Music Video Production",
            "Documentary-Style Coverage",
            "Drone Aerial Footage",
            "Social Media Short-Form Videos",
        ],
        image: "https://images-pw.pixieset.com/site/gley00/ZOoR3p/DSC_0143_fc9b7ee7_2048.jpg",
        price: "Starting from $800",
    },
    {
        id: "social",
        icon: "Share2",
        title: "Social Media Marketing",
        tagline: "Grow Your Brand Online",
        description:
            "Strategic social media management that builds authentic connections with your audience. From content creation to analytics, we handle everything so you can focus on your business.",
        features: [
            "Custom Content Strategy",
            "Professional Photo & Video Content",
            "Caption Copywriting",
            "Scheduling & Posting",
            "Community Management",
            "Monthly Performance Reports",
        ],
        image: "https://images-pw.pixieset.com/site/gley00/5ylE7p/DSC_0042_030f432c_2048.jpg",
        price: "Starting from $400/month",
    },
];

export default async function ServicesPage() {
    const content = await getPageContent("services");

    const headerTitle = content.header?.title || "Our Services";
    const headerSubtitle = content.header?.subtitle || "Every service is delivered with the same standard of excellence — meticulous craftsmanship, creative vision, and a deep commitment to your satisfaction.";

    const services = content.items || DEFAULT_SERVICES;

    return (
        <>
            {/* Header */}
            <section className="pt-40 pb-20 text-center max-w-3xl mx-auto px-6">
                <p className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                    What We Offer
                </p>
                <h1
                    className="text-6xl md:text-7xl font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    {headerTitle}
                </h1>
                <p className="text-[#666] text-lg leading-relaxed">
                    {headerSubtitle}
                </p>
            </section>

            {/* Services */}
            <section className="pb-32">
                {services.map((svc: any, i: number) => {
                    const SvcIcon = ICON_MAP[svc.icon] || Camera;
                    return (
                        <div key={svc.id} id={svc.id}>
                            <div
                                className={`max-w-7xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Image */}
                                <div
                                    className={`relative overflow-hidden rounded-sm ${i % 2 === 1 ? "lg:order-2" : ""}`}
                                >
                                    <img
                                        src={svc.image}
                                        alt={svc.title}
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
                                    <div className="absolute bottom-6 left-6">
                                        <span className="glass-cyan text-[#00D2B9] text-xs tracking-[0.1em] uppercase px-3 py-1.5 rounded-sm font-medium">
                                            {svc.price}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                                    <div className="w-12 h-12 rounded-full bg-[#00D2B9]/10 flex items-center justify-center mb-6">
                                        <SvcIcon size={22} className="text-[#00D2B9]" />
                                    </div>
                                    <p className="text-[#00D2B9] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                                        {svc.tagline}
                                    </p>
                                    <h2
                                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                                        style={{ fontFamily: "var(--font-playfair), serif" }}
                                    >
                                        {svc.title}
                                    </h2>
                                    <p className="text-[#666] leading-relaxed mb-8">{svc.description}</p>

                                    <ul className="space-y-3 mb-10">
                                        {svc.features.map((f: string) => (
                                            <li key={f} className="flex items-center gap-3 text-sm text-[#a0a0a0]">
                                                <Check size={14} className="text-[#00D2B9] shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/book" className="btn-cyan">
                                        Book This Service
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {i < services.length - 1 && <div className="divider-cyan mx-12" />}
                        </div>
                    );
                })}
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#0d0d0d] text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Not Sure What You Need?
                    </h2>
                    <p className="text-[#666] mb-8 leading-relaxed">
                        Get in touch and we'll help you design the perfect package for your project.
                    </p>
                    <Link href="/contact" className="btn-cyan">
                        Let's Talk <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </>
    );
}
