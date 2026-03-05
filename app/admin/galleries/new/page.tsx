"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft, Save, Loader2, Image as ImageIcon,
    Lock, Calendar, Download, Users
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function NewGalleryPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [loadingClients, setLoadingClients] = useState(true);
    const [clients, setClients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        clientId: "",
        password: "",
        allowDownload: true,
        expiresAt: "",
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/leads"); // Or /api/clients if it exists
            const data = await res.json();
            // We need to find clients, not just leads. 
            // In this system, Client is a converted Lead.
            const clientsOnly = data.filter((l: any) => l.clientId);
            setClients(clientsOnly);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        } finally {
            setLoadingClients(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/galleries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Gallery created!");
                router.push("/admin/galleries");
                router.refresh();
            } else {
                const err = await res.json();
                toast.error(err.error?.message || "Failed to create gallery");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/galleries" className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#666]">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Gallery</h1>
                    <p className="text-[#666] text-sm">Create a new photo or video gallery for a client.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="card-luxury p-8 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <ImageIcon className="text-[#00D2B9]" size={20} />
                            Gallery Info
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Gallery Name *</label>
                                <input
                                    required
                                    type="text"
                                    className="input-luxury w-full"
                                    placeholder="e.g., Smith Wedding - Highlights"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Select Client *</label>
                                <select
                                    required
                                    className="input-luxury w-full"
                                    value={formData.clientId}
                                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                >
                                    <option value="">Choose a client...</option>
                                    {clients.map(c => (
                                        <option key={c.clientId} value={c.clientId}>{c.name}</option>
                                    ))}
                                </select>
                                {loadingClients && <p className="text-[10px] text-[#444] animate-pulse">Loading clients...</p>}
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="card-luxury p-8 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <Lock className="text-[#00D2B9]" size={20} />
                            Security & Settings
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Access Password (Optional)</label>
                                <input
                                    type="password"
                                    className="input-luxury w-full"
                                    placeholder="Leave blank for public"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Expiration Date</label>
                                <input
                                    type="date"
                                    className="input-luxury w-full"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
                                <input
                                    type="checkbox"
                                    id="allowDownload"
                                    className="accent-[#00D2B9]"
                                    checked={formData.allowDownload}
                                    onChange={(e) => setFormData({ ...formData, allowDownload: e.target.checked })}
                                />
                                <label htmlFor="allowDownload" className="text-sm text-white flex items-center gap-2">
                                    <Download size={14} className="text-[#666]" /> Allow Full-Res Downloads
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pb-12">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 text-[#666] hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-cyan px-12 py-3 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? "Creating..." : "Create Gallery"}
                    </button>
                </div>
            </form>
        </div>
    );
}

import { TrendingUp } from "lucide-react";
