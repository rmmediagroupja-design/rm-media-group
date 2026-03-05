"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Save, Plus, Trash2, ArrowUp, ArrowDown, Settings2,
    Type, Image as ImageIcon, LayoutGrid, Maximize2,
    ChevronLeft, Loader2, Sparkles, Wand2, X
} from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface PageBlock {
    id?: string;
    type: "HERO" | "GALLERY_GRID" | "TEXT_IMAGE" | "TEXT" | "CONTACT_FORM";
    content: any;
    order: number;
}

interface PageData {
    id: string;
    title: string;
    description: string;
    slug: string;
    blocks: PageBlock[];
}

const BLOCK_TYPES = [
    { type: "HERO", label: "Hero Header", icon: Maximize2, defaultContent: { title: "Title Here", subtitle: "Subtitle here", imageUrl: "", buttonText: "Contact Us", buttonLink: "/contact" } },
    { type: "TEXT", label: "Rich Text", icon: Type, defaultContent: { body: "Enter your content here..." } },
    { type: "TEXT_IMAGE", label: "Text & Image", icon: ImageIcon, defaultContent: { title: "Section Title", body: "Description...", imageUrl: "", imageSide: "left" } },
    { type: "GALLERY_GRID", label: "Image Gallery", icon: LayoutGrid, defaultContent: { title: "Our Portfolio", images: [] } },
    { type: "CONTACT_FORM", label: "Contact Section", icon: Sparkles, defaultContent: { title: "Get in Touch", description: "Let's create something classic together." } },
];

export default function PageBuilderStudio() {
    const { id } = useParams();
    const router = useRouter();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeBlock, setActiveBlock] = useState<number | null>(null);

    useEffect(() => {
        if (id) fetchPage();
    }, [id]);

    const fetchPage = async () => {
        try {
            const res = await fetch(`/api/pages/${id}`);
            const data = await res.json();
            setPage(data);
        } catch (error) {
            console.error("Failed to fetch page", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!page) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/pages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(page),
            });
            if (res.ok) {
                // Flash success or notify
                router.refresh();
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSaving(false);
        }
    };

    const addBlock = (typeObj: typeof BLOCK_TYPES[0]) => {
        if (!page) return;
        const newBlock: PageBlock = {
            type: typeObj.type as any,
            content: { ...typeObj.defaultContent },
            order: page.blocks.length
        };
        setPage({ ...page, blocks: [...page.blocks, newBlock] });
        setActiveBlock(page.blocks.length);
    };

    const deleteBlock = (index: number) => {
        if (!page) return;
        const newBlocks = page.blocks.filter((_, i) => i !== index);
        setPage({ ...page, blocks: newBlocks });
        setActiveBlock(null);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (!page) return;
        const newBlocks = [...page.blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setPage({ ...page, blocks: newBlocks });
        setActiveBlock(targetIndex);
    };

    const updateBlockContent = (index: number, newContent: any) => {
        if (!page) return;
        const newBlocks = [...page.blocks];
        newBlocks[index].content = { ...newBlocks[index].content, ...newContent };
        setPage({ ...page, blocks: newBlocks });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="animate-spin text-[#00D2B9]" size={48} />
            <p className="text-[#666] tracking-widest uppercase text-xs">Entering Studio...</p>
        </div>
    );

    if (!page) return <div>Page not found</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden -m-8">
            {/* Top Toolbar */}
            <div className="h-16 border-b border-[#222] bg-[#0c0c0c] flex items-center justify-between px-8 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="text-[#666] hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-white font-bold tracking-tight">{page.title}</h1>
                        <p className="text-[10px] text-[#444] uppercase tracking-wider">Editor Mode • /{page.slug}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-cyan flex items-center gap-2 px-6 py-2 h-10"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {saving ? "Saving..." : "Publish Changes"}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Visual Canvas (Left) */}
                <div className="flex-1 overflow-y-auto bg-[#141414] p-12 space-y-8 studio-canvas custom-scrollbar">
                    {page.blocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-[#222] rounded-2xl">
                            <Wand2 className="text-[#222] mb-4" size={64} />
                            <h3 className="text-[#666] font-medium">Your canvas is empty</h3>
                            <p className="text-[#444] text-xs mt-2">Add a block from the right panel to get started.</p>
                        </div>
                    ) : (
                        page.blocks.map((block, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveBlock(index)}
                                className={`relative group transition-all duration-300 rounded-lg cursor-pointer animate-in fade-in zoom-in-95 ${activeBlock === index
                                    ? "ring-2 ring-[#00D2B9] ring-offset-4 ring-offset-[#141414] shadow-2xl shadow-[#00D2B9]/10"
                                    : "hover:ring-1 hover:ring-[#333]"
                                    }`}
                            >
                                {/* Block Controls Overlay */}
                                <div className={`absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                                        disabled={index === 0}
                                        className="p-2 bg-[#222] hover:bg-[#333] text-white rounded-md disabled:opacity-20 transition-colors"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                                        disabled={index === page.blocks.length - 1}
                                        className="p-2 bg-[#222] hover:bg-[#333] text-white rounded-md disabled:opacity-20 transition-colors"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteBlock(index); }}
                                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition-all mt-4"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* Simplified Visual Representation */}
                                <div className="bg-[#0c0c0c] border border-[#222] rounded-lg p-8 min-h-[120px] shadow-sm">
                                    <div className="flex items-center gap-3 mb-4 text-[#444] border-b border-[#1a1a1a] pb-2">
                                        {(() => {
                                            const typeObj = BLOCK_TYPES.find(b => b.type === block.type);
                                            const Icon = typeObj?.icon || LayoutGrid;
                                            return (
                                                <>
                                                    <Icon size={14} />
                                                    <span className="text-[10px] uppercase tracking-widest font-bold">{typeObj?.label}</span>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Block Content Glimpse */}
                                    <div className="space-y-2">
                                        {block.type === "HERO" && (
                                            <>
                                                <h4 className="text-white text-lg font-bold">{block.content.title}</h4>
                                                <p className="text-[#666] text-xs">{block.content.subtitle}</p>
                                            </>
                                        )}
                                        {block.type === "TEXT" && (
                                            <p className="text-[#888] text-sm italic">"{block.content.body.substring(0, 100)}..."</p>
                                        )}
                                        {block.type === "GALLERY_GRID" && (
                                            <div className="grid grid-cols-4 gap-2">
                                                {Array(4).fill(0).map((_, i) => (
                                                    <div key={i} className="aspect-square bg-[#222] rounded-sm" />
                                                ))}
                                            </div>
                                        )}
                                        {block.type === "TEXT_IMAGE" && (
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 bg-[#222] rounded" />
                                                <div className="flex-1 space-y-1">
                                                    <div className="h-4 w-1/2 bg-[#222] rounded" />
                                                    <div className="h-2 w-full bg-[#1a1a1a] rounded" />
                                                </div>
                                            </div>
                                        )}
                                        {block.type === "CONTACT_FORM" && (
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-[#444] uppercase tracking-tight">Standard Inquiry Form</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Properties Inspector (Right) */}
                <aside className="w-[400px] bg-[#0c0c0c] border-l border-[#222] flex flex-col z-10 shadow-2xl">
                    <div className="flex h-12 border-b border-[#222]">
                        <button className="flex-1 text-[10px] uppercase tracking-widest font-bold text-[#00D2B9] border-b-2 border-[#00D2B9]">Inspector</button>
                        <button className="flex-1 text-[10px] uppercase tracking-widest font-bold text-[#444] hover:text-[#666]">Layers</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        {activeBlock !== null ? (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-white font-bold tracking-tight">Edit {page.blocks[activeBlock].type}</h2>
                                    <button onClick={() => setActiveBlock(null)} className="text-[#444] hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Dynamic Controls based on block type */}
                                <div className="space-y-6">
                                    {(page.blocks[activeBlock].type === "HERO" || page.blocks[activeBlock].type === "TEXT_IMAGE") && (
                                        <div className="space-y-4">
                                            <label className="block text-[10px] text-[#666] uppercase tracking-widest font-semibold">Image Asset</label>
                                            <ImageUploader
                                                value={page.blocks[activeBlock].content.imageUrl}
                                                onChange={(url) => updateBlockContent(activeBlock, { imageUrl: url })}
                                            />
                                        </div>
                                    )}

                                    {page.blocks[activeBlock].content.title !== undefined && (
                                        <div className="space-y-2">
                                            <label className="block text-[10px] text-[#666] uppercase tracking-widest font-semibold">Title</label>
                                            <input
                                                type="text"
                                                value={page.blocks[activeBlock].content.title}
                                                onChange={(e) => updateBlockContent(activeBlock, { title: e.target.value })}
                                                className="input-luxury w-full"
                                            />
                                        </div>
                                    )}

                                    {page.blocks[activeBlock].content.subtitle !== undefined && (
                                        <div className="space-y-2">
                                            <label className="block text-[10px] text-[#666] uppercase tracking-widest font-semibold">Subtitle</label>
                                            <textarea
                                                value={page.blocks[activeBlock].content.subtitle}
                                                onChange={(e) => updateBlockContent(activeBlock, { subtitle: e.target.value })}
                                                className="input-luxury w-full min-h-[80px]"
                                            />
                                        </div>
                                    )}

                                    {page.blocks[activeBlock].content.body !== undefined && (
                                        <div className="space-y-2">
                                            <label className="block text-[10px] text-[#666] uppercase tracking-widest font-semibold">Content</label>
                                            <textarea
                                                value={page.blocks[activeBlock].content.body}
                                                onChange={(e) => updateBlockContent(activeBlock, { body: e.target.value })}
                                                className="input-luxury w-full min-h-[120px]"
                                            />
                                        </div>
                                    )}

                                    {page.blocks[activeBlock].type === "GALLERY_GRID" && (
                                        <div className="space-y-4">
                                            <label className="block text-[10px] text-[#666] uppercase tracking-widest font-semibold">Add to Gallery</label>
                                            <ImageUploader
                                                value=""
                                                onChange={(url) => {
                                                    const current = page.blocks[activeBlock].content.images || [];
                                                    updateBlockContent(activeBlock, { images: [...current, { url }] });
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                {(page.blocks[activeBlock].content.images || []).map((img: any, i: number) => (
                                                    <div key={i} className="relative aspect-square rounded overflow-hidden group">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={img.url} alt="Gallery" className="object-cover w-full h-full" />
                                                        <button
                                                            onClick={() => {
                                                                const filtered = page.blocks[activeBlock].content.images.filter((_: any, idx: number) => idx !== i);
                                                                updateBlockContent(activeBlock, { images: filtered });
                                                            }}
                                                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="text-white" size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-white font-bold tracking-tight mb-6">Add Sections</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {BLOCK_TYPES.map((type) => (
                                        <button
                                            key={type.type}
                                            onClick={() => addBlock(type)}
                                            className="flex items-center gap-4 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#00D2B9]/50 p-4 rounded-xl transition-all group group text-left"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-[#222] group-hover:bg-[#00D2B9]/10 flex items-center justify-center text-[#666] group-hover:text-[#00D2B9] transition-colors">
                                                <type.icon size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white mb-0.5">{type.label}</div>
                                                <div className="text-[10px] text-[#444] uppercase tracking-tight">Insert block</div>
                                            </div>
                                            <Plus size={16} className="text-[#333] group-hover:text-[#00D2B9] transition-colors" />
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-[#222]">
                                    <h3 className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-4">Page Settings</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] text-[#666] uppercase tracking-widest font-semibold">Meta Description</label>
                                            <textarea
                                                value={page.description || ""}
                                                onChange={(e) => setPage({ ...page, description: e.target.value })}
                                                placeholder="SEO description..."
                                                className="input-luxury w-full text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
