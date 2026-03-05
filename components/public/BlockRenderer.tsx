import { Camera, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlockProps {
    content: any;
}

// ─── HERO BLOCK ─────────────────────────────────────────────────────────────
const HeroBlock = ({ content }: BlockProps) => (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-20 overflow-hidden">
        {content.imageUrl && (
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
            <h1
                className="text-6xl md:text-8xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
            >
                {content.title}
            </h1>
            <p className="text-[#a0a0a0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {content.subtitle}
            </p>
            {content.buttonText && (
                <div className="pt-8">
                    <Link href={content.buttonLink || "/contact"} className="btn-cyan px-10 py-4 h-auto text-sm uppercase tracking-widest font-bold">
                        {content.buttonText}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            )}
        </div>
    </section>
);

// ─── TEXT BLOCK ─────────────────────────────────────────────────────────────
const TextBlock = ({ content }: BlockProps) => (
    <section className="py-24 max-w-3xl mx-auto px-6">
        <div
            className="text-[#888] text-lg md:text-xl leading-[1.8] font-serif italic text-center"
            dangerouslySetInnerHTML={{ __html: content.body.replace(/\n/g, '<br/>') }}
        />
    </section>
);

// ─── TEXT & IMAGE BLOCK ──────────────────────────────────────────────────────
const TextImageBlock = ({ content }: BlockProps) => (
    <section className="py-32">
        <div className={cn(
            "max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center",
            content.imageSide === "right" ? "lg:flex-row-reverse" : ""
        )}>
            <div className={cn("relative rounded-sm overflow-hidden", content.imageSide === "right" ? "lg:order-2" : "lg:order-1")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
            <div className={content.imageSide === "right" ? "lg:order-1" : "lg:order-2"}>
                <h2
                    className="text-4xl md:text-6xl font-bold text-white mb-8"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    {content.title}
                </h2>
                <p className="text-[#666] text-lg leading-relaxed mb-10">
                    {content.body}
                </p>
            </div>
        </div>
    </section>
);

// ─── GALLERY BLOCK ──────────────────────────────────────────────────────────
const GalleryGridBlock = ({ content }: BlockProps) => (
    <section className="py-32 max-w-[1600px] mx-auto px-6">
        {content.title && (
            <div className="text-center mb-20">
                <h2
                    className="text-5xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    {content.title}
                </h2>
                <div className="divider-cyan mx-auto mt-6" />
            </div>
        )}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {(content.images || []).map((img: any, i: number) => (
                <div key={i} className="relative group overflow-hidden rounded-sm break-inside-avoid">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.url}
                        alt="Portfolio"
                        className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
            ))}
        </div>
    </section>
);

// ─── CONTACT FORM BLOCK ─────────────────────────────────────────────────────
const ContactFormBlock = ({ content }: BlockProps) => (
    <section className="py-32 bg-[#0c0c0c]">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2
                className="text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-playfair), serif" }}
            >
                {content.title}
            </h2>
            <p className="text-[#666] mb-12">{content.description}</p>
            <Link href="/contact" className="btn-cyan mx-auto">
                Begin Your Project
                <ArrowRight size={18} />
            </Link>
        </div>
    </section>
);

const BLOCK_COMPONENTS: Record<string, React.FC<BlockProps>> = {
    HERO: HeroBlock,
    TEXT: TextBlock,
    TEXT_IMAGE: TextImageBlock,
    GALLERY_GRID: GalleryGridBlock,
    CONTACT_FORM: ContactFormBlock,
};

export function BlockRenderer({ blocks }: { blocks: any[] }) {
    return (
        <div className="flex flex-col">
            {blocks.map((block, index) => {
                const Component = BLOCK_COMPONENTS[block.type];
                if (!Component) return null;
                return <Component key={block.id || index} content={block.content} />;
            })}
        </div>
    );
}
