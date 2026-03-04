import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function PublicFooter() {
    return (
        <footer className="bg-[#080808] border-t border-[#252525]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="mb-4">
                            <span
                                className="text-[#00D2B9] font-bold text-lg tracking-[0.25em] uppercase block"
                                style={{ fontFamily: "var(--font-playfair), serif" }}
                            >
                                RM MEDIA GROUP JA
                            </span>
                            <p className="text-[#666] text-sm mt-3 leading-relaxed max-w-sm">
                                Jamaica's premier photography, videography, and social media agency. We craft
                                cinematic stories that leave lasting impressions.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#666] hover:text-[#00D2B9] transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#666] hover:text-[#00D2B9] transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#666] hover:text-[#00D2B9] transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#00D2B9] mb-4">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/portfolio", label: "Portfolio" },
                                { href: "/services", label: "Services" },
                                { href: "/about", label: "About" },
                                { href: "/contact", label: "Contact" },
                                { href: "/book", label: "Book a Session" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[#666] hover:text-[#00D2B9] text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#00D2B9] mb-4">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-[#666] text-sm">
                                <Mail size={14} className="text-[#00D2B9] shrink-0" />
                                <span>info@rmmediagroup.com</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#666] text-sm">
                                <Phone size={14} className="text-[#00D2B9] shrink-0" />
                                <span>+1 (876) 000-0000</span>
                            </li>
                            <li className="flex items-start gap-2 text-[#666] text-sm">
                                <MapPin size={14} className="text-[#00D2B9] shrink-0 mt-0.5" />
                                <span>Kingston, Jamaica</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="divider-cyan my-10" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[#444] text-xs tracking-wider">
                        © {new Date().getFullYear()} RM Media Group JA. All rights reserved.
                    </p>
                    <Link
                        href="/login"
                        className="text-[#333] hover:text-[#666] text-xs tracking-wider transition-colors"
                    >
                        Client Portal
                    </Link>
                </div>
            </div>
        </footer>
    );
}
