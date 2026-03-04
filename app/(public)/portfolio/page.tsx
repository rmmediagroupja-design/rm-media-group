import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio",
    description: "View the photography and videography portfolio of RM Media Group JA.",
};

const PORTFOLIO_ITEMS = [
    { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80", alt: "Cinematic Wedding", category: "Weddings", span: "col-span-2 row-span-2" },
    { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&auto=format&fit=crop&q=80", alt: "Editorial Portrait", category: "Portraits", span: "" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Luxury Wedding", category: "Weddings", span: "" },
    { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80", alt: "Destination Wedding", category: "Weddings", span: "" },
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&auto=format&fit=crop&q=80", alt: "Wedding Reception", category: "Events", span: "col-span-2" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80", alt: "Fashion Portrait", category: "Portraits", span: "" },
    { src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&auto=format&fit=crop&q=80", alt: "Event Coverage", category: "Events", span: "" },
    { src: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&auto=format&fit=crop&q=80", alt: "Brand Campaign", category: "Commercial", span: "" },
    { src: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=800&auto=format&fit=crop&q=80", alt: "Product Photography", category: "Commercial", span: "" },
    { src: "https://images.unsplash.com/photo-1582128582959-b80f8c5e5a77?w=1200&auto=format&fit=crop&q=80", alt: "Corporate Videography", category: "Videography", span: "col-span-2" },
];

export default function PortfolioPage() {
    return (
        <>
            {/* Header */}
            <section className="pt-40 pb-16 text-center px-6">
                <p className="text-[#00D2B9] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                    Our Work
                </p>
                <h1
                    className="text-6xl md:text-7xl font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    Portfolio
                </h1>
                <p className="text-[#666] text-lg max-w-xl mx-auto leading-relaxed">
                    A curated selection of our finest work — each image a story, each frame a memory.
                </p>
            </section>

            {/* Gallery Grid */}
            <section className="pb-32 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[220px]">
                    {PORTFOLIO_ITEMS.map((work, i) => (
                        <div
                            key={i}
                            className={`relative overflow-hidden group cursor-pointer ${work.span}`}
                        >
                            <img
                                src={work.src}
                                alt={work.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="text-white text-sm font-medium tracking-wide text-center px-4">
                                    {work.alt}
                                </span>
                                <span className="text-[#00D2B9] text-xs tracking-[0.1em] uppercase mt-2">
                                    {work.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <p className="text-[#666] text-sm mb-6">
                        Ready to add your story to our portfolio?
                    </p>
                    <Link href="/book" className="btn-cyan">
                        Book Your Session <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </>
    );
}
