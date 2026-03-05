"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft, Save, Loader2, Users,
    Instagram, Facebook, Video, Twitter, Youtube,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const PACKAGES = ["BASIC", "STANDARD", "PREMIUM", "CUSTOM"];

export default function NewMarketingClient() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        package: "STANDARD",
        monthlyFee: 0,
        instagram: "",
        facebook: "",
        tiktok: "",
        youtube: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/marketing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Marketing client created!");
                router.push("/admin/marketing");
                router.refresh();
            } else {
                const err = await res.json();
                toast.error(err.error?.message || "Failed to create client");
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
                <Link href="/admin/marketing" className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#666]">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">New Marketing Client</h1>
                    <p className="text-[#666] text-sm">Onboard a new social media management client.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Core Info */}
                    <div className="card-luxury p-8 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <Users className="text-[#00D2B9]" size={20} />
                            Business Details
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Business Name *</label>
                                <input
                                    required
                                    type="text"
                                    className="input-luxury w-full"
                                    placeholder="Enter business name"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Contact Person</label>
                                <input
                                    type="text"
                                    className="input-luxury w-full"
                                    placeholder="Full name"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        className="input-luxury w-full"
                                        placeholder="client@example.com"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input-luxury w-full"
                                        placeholder="+1 (876) ..."
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package & Fee */}
                    <div className="card-luxury p-8 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <Briefcase className="text-[#00D2B9]" size={20} />
                            Contractual Info
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Service Package</label>
                                <select
                                    className="input-luxury w-full"
                                    value={formData.package}
                                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                >
                                    {PACKAGES.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Monthly Fee (USD) *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]">$</span>
                                    <input
                                        required
                                        type="number"
                                        className="input-luxury w-full pl-8"
                                        placeholder="0.00"
                                        value={formData.monthlyFee}
                                        onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Internal Notes</label>
                                <textarea
                                    className="input-luxury w-full min-h-[100px]"
                                    placeholder="Strategic goals, preferences, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="card-luxury p-8 space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <TrendingUp className="text-[#00D2B9]" size={20} />
                        Social Media Links
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-2">
                                <Instagram size={12} /> Instagram URL
                            </label>
                            <input
                                type="url"
                                className="input-luxury w-full"
                                placeholder="https://instagram.com/..."
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-2">
                                <Facebook size={12} /> Facebook URL
                            </label>
                            <input
                                type="url"
                                className="input-luxury w-full"
                                placeholder="https://facebook.com/..."
                                value={formData.facebook}
                                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-2">
                                <Video size={12} /> TikTok URL
                            </label>
                            <input
                                type="url"
                                className="input-luxury w-full"
                                placeholder="https://tiktok.com/@..."
                                value={formData.tiktok}
                                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-2">
                                <Youtube size={12} /> YouTube URL
                            </label>
                            <input
                                type="url"
                                className="input-luxury w-full"
                                placeholder="https://youtube.com/..."
                                value={formData.youtube}
                                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                            />
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
                        {saving ? "Creating..." : "Save Marketing Client"}
                    </button>
                </div>
            </form>
        </div>
    );
}

import { TrendingUp } from "lucide-react";
