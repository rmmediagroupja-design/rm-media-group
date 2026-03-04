"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "bg-[#080808]/95 backdrop-blur-md border-b border-[#252525]"
                    : "bg-transparent"
            )}
        >
            <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex flex-col leading-none">
                        <span
                            className="text-[#00D2B9] font-bold text-sm tracking-[0.25em] uppercase"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                            RM MEDIA
                        </span>
                        <span className="text-[#666] text-[0.6rem] tracking-[0.3em] uppercase">
                            Group JA
                        </span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={cn(
                                    "text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200",
                                    pathname === link.href
                                        ? "text-[#00D2B9]"
                                        : "text-[#a0a0a0] hover:text-white"
                                )}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/book" className="btn-cyan text-xs py-3 px-6">
                        Book Now
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-[#a0a0a0] hover:text-white p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#111111] border-t border-[#252525] px-6 py-6">
                    <ul className="flex flex-col gap-4">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "text-sm tracking-[0.1em] uppercase font-medium",
                                        pathname === link.href ? "text-[#00D2B9]" : "text-[#a0a0a0]"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/book" onClick={() => setMobileOpen(false)} className="btn-cyan text-xs py-3 w-full justify-center mt-2">
                                Book Now
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
