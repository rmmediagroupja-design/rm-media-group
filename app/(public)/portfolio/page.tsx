import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio",
    description: "View the photography and videography portfolio of RM Media Group JA.",
};

const CATEGORIES = ["All", "Weddings", "Portraits", "Corporate", "Videography", "Commercial"];

const PORTFOLIO_ITEMS = [
    { src: "https://images-pw.pixieset.com/site/gley00/yQAy6Z/DSCF2058_e1baadd3_2048.jpg", alt: "Photography is Poetry", category: "Weddings", span: "col-span-2 row-span-2" },
    { src: "https://images-pw.pixieset.com/site/gley00/RmZpkj/DSCF3720_ec08a69b_2048.jpg", alt: "Capturing Moments", category: "Weddings", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/5wRQ8j/DSCF2168_4361a427_2048.jpg", alt: "Editorial Portrait", category: "Portraits", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/LVO8vk/5f292c2483c306060c487f9e5792aa12_0fe73901_2048.JPG", alt: "Lifestyle Beauty", category: "Commercial", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/baXAGz/1713844791402_515c6beb_2048.jpg", alt: "Studio Portrait", category: "Portraits", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/q8Ao74/DSCF1660_748f36ba_2048.jpg", alt: "Creative Campaigns", category: "Commercial", span: "col-span-2" },
    { src: "https://images-pw.pixieset.com/site/gley00/baXAy8/1713891797477_dda9b5a5_2048.jpg", alt: "Event Coverage", category: "Commercial", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/5ylE7p/DSC_0042_030f432c_2048.jpg", alt: "Commercial Videography", category: "Videography", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/xk4X5P/DSC_0075_f1b8c1df_2048.jpg", alt: "Product Photography", category: "Commercial", span: "" },
    { src: "https://images-pw.pixieset.com/site/gley00/ZOoR3p/DSC_0143_fc9b7ee7_2048.jpg", alt: "Brand Campaigns", category: "Videography", span: "col-span-2" },
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
                    {PORTFOLIO_ITEMS.map((work: any, i: number) => (
                        <div
                            key={i}
                            className={`relative overflow-hidden group cursor-pointer ${work.span}`}
                        >
                            <img
                                src={work.src}
                                alt={work.alt}
                                referrerPolicy="no-referrer"
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
