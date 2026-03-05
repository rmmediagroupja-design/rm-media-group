"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Search, Layout } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Page {
    id: string;
    slug: string;
    title: string;
    _count: {
        blocks: number;
    };
    updatedAt: string;
}

export default function PagesManagement() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newPage, setNewPage] = useState({ title: "", slug: "" });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch("/api/pages");
            const data = await res.json();
            if (Array.isArray(data)) setPages(data);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPage),
            });
            if (res.ok) {
                const created = await res.json();
                setPages([created, ...pages]);
                setIsCreating(false);
                setNewPage({ title: "", slug: "" });
            }
        } catch (error) {
            console.error("Failed to create page", error);
        }
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Site Pages
                    </h1>
                    <p className="text-[#666] text-sm mt-1">Manage your dynamic website pages and layouts.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-cyan flex items-center gap-2"
                >
                    <Plus size={18} /> New Page
                </button>
            </div>

            {/* Create Modal Mockup/Inline */}
            {isCreating && (
                <div className="card-luxury p-6 border-[#00D2B9]/30 bg-[#00D2B9]/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleCreatePage} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] text-[#666] uppercase tracking-widest mb-2 font-semibold">Page Title</label>
                            <input
                                type="text"
                                value={newPage.title}
                                onChange={e => setNewPage({ ...newPage, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="e.g. Wedding Services"
                                className="input-luxury w-full"
                                required
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] text-[#666] uppercase tracking-widest mb-2 font-semibold">URL Slug</label>
                            <div className="flex items-center">
                                <span className="text-[#444] text-xs mr-2">/</span>
                                <input
                                    type="text"
                                    value={newPage.slug}
                                    onChange={e => setNewPage({ ...newPage, slug: e.target.value })}
                                    placeholder="wedding-services"
                                    className="input-luxury w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-cyan h-11 px-6">Create</button>
                            <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary h-11 px-6">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex items-center gap-4 bg-[#111] p-4 rounded-lg border border-[#222]">
                <Search size={18} className="text-[#444]" />
                <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm text-white w-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card-luxury h-48 animate-pulse bg-[#111]" />
                    ))
                ) : filteredPages.length > 0 ? (
                    filteredPages.map(page => (
                        <div key={page.id} className="card-luxury p-6 hover:border-[#00D2B9]/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Layout size={48} className="text-[#00D2B9]" />
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00D2B9] transition-colors">{page.title}</h3>
                                <code className="text-[10px] text-[#666] bg-[#000] px-2 py-0.5 rounded tracking-wider uppercase">/{page.slug}</code>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-[10px] text-[#444] space-y-1">
                                    <div className="flex items-center gap-1 uppercase tracking-tight">
                                        <span className="text-[#666]">{page._count.blocks}</span> Layout Blocks
                                    </div>
                                    <div className="uppercase tracking-tight">Updated {formatDate(page.updatedAt)}</div>
                                </div>
                                <div className="flex gap-2 z-10">
                                    <Link
                                        href={`/admin/pages/${page.id}`}
                                        className="p-2 bg-[#1a1a1a] hover:bg-[#00D2B9]/10 text-[#666] hover:text-[#00D2B9] rounded-md transition-all"
                                        title="Edit Builder"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <a
                                        href={`/${page.slug}`}
                                        target="_blank"
                                        className="p-2 bg-[#1a1a1a] hover:bg-white/10 text-[#666] hover:text-white rounded-md transition-all"
                                        title="View Public"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center card-luxury border-dashed">
                        <Layout className="mx-auto text-[#222] mb-4" size={48} />
                        <h3 className="text-lg text-[#666]">No pages found</h3>
                        <p className="text-sm text-[#444] mt-1">Start by creating your first dynamic page.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
