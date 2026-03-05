"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard, Users, Calendar, FileText, Receipt,
    Image, Share2, DollarSign, LogOut, ChevronRight, Menu, X, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/quotes", label: "Quotes", icon: FileText },
    { href: "/admin/invoices", label: "Invoices", icon: Receipt },
    { href: "/admin/galleries", label: "Galleries", icon: Image },
    { href: "/admin/marketing", label: "Marketing", icon: Share2 },
    { href: "/admin/finance", label: "Finance", icon: DollarSign },
    { href: "/admin/pages", label: "Pages", icon: FileText },
    { href: "/admin/appearance", label: "Appearance", icon: Palette },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (item: typeof NAV_ITEMS[0]) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="px-6 py-6 border-b border-[#252525]">
                <Link href="/admin" className="block">
                    <span
                        className="text-[#00D2B9] font-bold text-sm tracking-[0.2em] uppercase block"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        RM MEDIA
                    </span>
                    <span className="text-[#444] text-[0.6rem] tracking-[0.25em] uppercase">Admin Dashboard</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn("admin-nav-item", isActive(item) && "active")}
                    >
                        <item.icon size={16} />
                        {item.label}
                        {isActive(item) && <ChevronRight size={12} className="ml-auto" />}
                    </Link>
                ))}
            </nav>

            {/* User footer */}
            <div className="border-t border-[#252525] p-4">
                <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#00D2B9]/20 flex items-center justify-center text-[#00D2B9] text-xs font-bold shrink-0">
                        {session?.user?.name?.[0] ?? "A"}
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-white font-medium truncate">
                            {session?.user?.name ?? "Admin"}
                        </div>
                        <div className="text-[0.65rem] text-[#666] truncate">
                            {session?.user?.role}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-[#0c0c0c]">
            {/* Desktop sidebar */}
            <aside className="admin-sidebar hidden lg:flex flex-col fixed top-0 left-0 h-full z-40">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-64 admin-sidebar flex flex-col">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 text-[#666] hover:text-white"
                        >
                            <X size={18} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
                {/* Top bar (mobile) */}
                <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-[#252525] bg-[#111111]">
                    <button onClick={() => setSidebarOpen(true)} className="text-[#a0a0a0] hover:text-white">
                        <Menu size={20} />
                    </button>
                    <span
                        className="text-[#00D2B9] text-sm font-bold tracking-[0.2em] uppercase"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        RM MEDIA
                    </span>
                    <div className="w-8" />
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
