"use client";

import { useState, useEffect } from "react";
import {
    Save,
    Globe,
    Layout,
    Info,
    Image as ImageIcon,
    Plus,
    Trash2,
    Loader2,
    Check
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useDebouncedCallback } from "use-debounce";

type Tab = "general" | "home" | "about" | "services";

export default function AppearancePage() {
    const [activeTab, setActiveTab] = useState<Tab>("home");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    async function fetchData() {
        setLoading(true);
        try {
            const [settingsRes] = await Promise.all([
                fetch("/api/cms"),
            ]);

            if (settingsRes.ok) setSettings(await settingsRes.json());

            if (activeTab !== "general") {
                const contentRes = await fetch(`/api/cms/content?page=${activeTab}`);
                if (contentRes.ok) setContent(await contentRes.json());
                else setContent({});
            }
        } catch (error) {
            console.error("Failed to fetch CMS data", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveSettings() {
        setSaving(true);
        try {
            const res = await fetch("/api/cms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                toast.success("Settings saved successfully");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    }

    const debouncedUpdateContent = useDebouncedCallback(
        async (section: string, key: string, value: any) => {
            try {
                await fetch("/api/cms/content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        page: activeTab,
                        section,
                        key,
                        content: value
                    }),
                });
            } catch (error) {
                console.error("Failed to update content", error);
                toast.error("Failed to update content");
            }
        },
        1000
    );

    function handleUpdateContent(section: string, key: string, value: any) {
        // Optimistic UI update
        const newContent = { ...content };
        if (!newContent[section]) newContent[section] = {};
        newContent[section][key] = value;
        setContent(newContent);

        // Trigger debounced API call
        debouncedUpdateContent(section, key, value);
    }

    async function handleUpdateArrayContent(field: string, value: any) {
        // For simple arrays like Services list
        setContent({ ...content, [field]: value });

        try {
            await fetch("/api/cms/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page: activeTab,
                    section: field,
                    content: value
                }),
            });
        } catch (error) {
            console.error("Failed to update content", error);
            toast.error("Failed to update content");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-cyan" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-white/90">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Site Appearance</h1>
                    <p className="text-muted mt-1 text-sm">Manage your website's public content and aesthetics.</p>
                </div>
                {activeTab === "general" && (
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="btn-cyan min-w-[140px]"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-black-soft border border-black-border rounded-lg inline-flex overflow-x-auto max-w-full">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "general" ? "bg-cyan text-black shadow-lg" : "text-muted hover:text-white"
                        }`}
                >
                    <Globe size={16} /> General
                </button>
                <button
                    onClick={() => setActiveTab("home")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "home" ? "bg-cyan text-black shadow-lg" : "text-muted hover:text-white"
                        }`}
                >
                    <Layout size={16} /> Home Page
                </button>
                <button
                    onClick={() => setActiveTab("about")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "about" ? "bg-cyan text-black shadow-lg" : "text-muted hover:text-white"
                        }`}
                >
                    <Info size={16} /> About Page
                </button>
                <button
                    onClick={() => setActiveTab("services")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "services" ? "bg-cyan text-black shadow-lg" : "text-muted hover:text-white"
                        }`}
                >
                    <Check size={16} /> Services Page
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ─── Main Editor Area ────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === "general" && (
                        <div className="card-luxury p-8 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Globe className="text-cyan" size={20} />
                                Global Settings
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Site Name</label>
                                        <input
                                            type="text"
                                            className="input-luxury"
                                            value={settings.siteName || ""}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            placeholder="RM Media Group JA"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Contact Email</label>
                                        <input
                                            type="email"
                                            className="input-luxury"
                                            value={settings.contactEmail || ""}
                                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                            placeholder="info@rmmedia.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Contact Phone</label>
                                        <input
                                            type="text"
                                            className="input-luxury"
                                            value={settings.contactPhone || ""}
                                            onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Site Logo</label>
                                        <ImageUploader
                                            value={settings.logoUrl || ""}
                                            onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                                            label="Upload Logo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Favicon</label>
                                        <ImageUploader
                                            value={settings.faviconUrl || ""}
                                            onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                                            label="Upload Favicon"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="divider-cyan/20 my-8" />

                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Social Media Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Instagram URL</label>
                                    <input
                                        type="text"
                                        className="input-luxury"
                                        value={settings.instagram || ""}
                                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Facebook URL</label>
                                    <input
                                        type="text"
                                        className="input-luxury"
                                        value={settings.facebook || ""}
                                        onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">YouTube URL</label>
                                    <input
                                        type="text"
                                        className="input-luxury"
                                        value={settings.youtube || ""}
                                        onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "home" && (
                        <div className="space-y-8">
                            <div className="card-luxury p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ImageIcon className="text-cyan" size={20} />
                                    Hero Section
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Headline</label>
                                        <input
                                            type="text"
                                            className="input-luxury"
                                            value={content.hero?.title || ""}
                                            onChange={(e) => handleUpdateContent("hero", "title", e.target.value)}
                                            placeholder="Your Story, Told Beautifully"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Subheadline</label>
                                        <textarea
                                            className="input-luxury min-h-[100px]"
                                            value={content.hero?.subtitle || ""}
                                            onChange={(e) => handleUpdateContent("hero", "subtitle", e.target.value)}
                                            placeholder="Jamaica's premiere visual storytelling agency..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Hero Image</label>
                                        <ImageUploader
                                            value={content.hero?.imageUrl || ""}
                                            onChange={(url) => handleUpdateContent("hero", "imageUrl", url)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="space-y-8">
                            <div className="card-luxury p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ImageIcon className="text-cyan" size={20} />
                                    About Hero
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Headline</label>
                                        <input
                                            type="text"
                                            className="input-luxury"
                                            value={content.hero?.title || ""}
                                            onChange={(e) => handleUpdateContent("hero", "title", e.target.value)}
                                            placeholder="Behind The Lens"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Subheadline</label>
                                        <textarea
                                            className="input-luxury min-h-[100px]"
                                            value={content.hero?.subtitle || ""}
                                            onChange={(e) => handleUpdateContent("hero", "subtitle", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Background Image</label>
                                        <ImageUploader
                                            value={content.hero?.imageUrl || ""}
                                            onChange={(url) => handleUpdateContent("hero", "imageUrl", url)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card-luxury p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Info className="text-cyan" size={20} />
                                    Our Mission
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Section Title</label>
                                        <input
                                            type="text"
                                            className="input-luxury"
                                            value={content.mission?.title || ""}
                                            onChange={(e) => handleUpdateContent("mission", "title", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Paragraph 1</label>
                                        <textarea
                                            className="input-luxury min-h-[100px]"
                                            value={content.mission?.text1 || ""}
                                            onChange={(e) => handleUpdateContent("mission", "text1", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Paragraph 2</label>
                                        <textarea
                                            className="input-luxury min-h-[100px]"
                                            value={content.mission?.text2 || ""}
                                            onChange={(e) => handleUpdateContent("mission", "text2", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "services" && (
                        <div className="space-y-8">
                            <div className="card-luxury p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Layout className="text-cyan" size={20} />
                                    Services Header
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Headline</label>
                                        <input
                                            type="text"
                                            className="input-luxury"
                                            value={content.header?.title || ""}
                                            onChange={(e) => handleUpdateContent("header", "title", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Subtitle</label>
                                        <textarea
                                            className="input-luxury min-h-[100px]"
                                            value={content.header?.subtitle || ""}
                                            onChange={(e) => handleUpdateContent("header", "subtitle", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card-luxury p-8 space-y-6">
                                <h3 className="text-lg font-bold text-white">Service Management</h3>
                                <p className="text-muted text-sm italic">Advanced service list management (Add/Remove/Reorder) is coming in a future update. For now, you can edit the header content above.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Preview Sidebar ────────────────────────────────────────── */}
                <div className="space-y-8">
                    <div className="card-luxury p-6 border-cyan/20 bg-cyan/5 sticky top-8">
                        <h3 className="text-cyan font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <ImageIcon size={16} /> Live Preview
                        </h3>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-black-border relative group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url('${content.hero?.imageUrl || (activeTab === "home" ? "https://images-pw.pixieset.com/site/gley00/yQAy6Z/DSCF2058_e1baadd3_2048.jpg" : "https://images-pw.pixieset.com/site/gley00/5ylE7p/DSC_0042_030f432c_2048.jpg")}')`,
                                    filter: "brightness(0.6)"
                                }}
                            ></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                <h4 className="text-white font-display text-lg font-bold leading-tight line-clamp-2">
                                    {content.hero?.title || (activeTab === "home" ? "Your Story, Told Beautifully." : (activeTab === "about" ? "Behind The Lens" : (content.header?.title || "Our Services")))}
                                </h4>
                                <p className="text-white/60 text-[10px] mt-2 line-clamp-2">
                                    {content.hero?.subtitle || content.header?.subtitle || "Cinematic moments captured for eternity."}
                                </p>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted mt-4 text-center italic uppercase tracking-tighter">
                            Preview for {activeTab} page view.
                        </p>
                    </div>

                    <div className="card-luxury p-6 space-y-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Editor Tips</h3>
                        <ul className="text-xs text-muted space-y-3 list-disc pl-4">
                            <li>Keep text concise for smaller screens.</li>
                            <li>Use unsplash or direct image links for now.</li>
                            <li>Changes are autosaved to the database.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
