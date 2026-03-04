import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

// ─── Class name utility ───────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ─── Currency formatting ──────────────────────────────────────────────────────
export function formatCurrency(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

// ─── Date formatting ──────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
    return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
    return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelative(date: Date | string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// ─── Invoice / Quote numbering ────────────────────────────────────────────────
export function generateInvoiceNumber(): string {
    const prefix = process.env.INVOICE_PREFIX ?? "INV";
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `${prefix}-${year}-${random}`;
}

export function generateQuoteNumber(): string {
    const prefix = process.env.QUOTE_PREFIX ?? "QUO";
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `${prefix}-${year}-${random}`;
}

// ─── File size formatting ─────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Invoice total calculation ────────────────────────────────────────────────
export function calculateTotals(
    items: { quantity: number; unitPrice: number }[],
    taxRate: number = 0,
    discount: number = 0
) {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + tax;
    return { subtotal, tax, total };
}

// ─── Status badge color mapping ───────────────────────────────────────────────
export const leadStatusColor: Record<string, string> = {
    NEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CONTACTED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    QUOTED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    BOOKED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    LOST: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const invoiceStatusColor: Record<string, string> = {
    UNPAID: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    PARTIAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PAID: "bg-green-500/20 text-green-400 border-green-500/30",
    OVERDUE: "bg-red-500/20 text-red-400 border-red-500/30",
    CANCELLED: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export const quoteStatusColor: Record<string, string> = {
    DRAFT: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    SENT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
    EXPIRED: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export const bookingStatusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    IN_PROGRESS: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ─── Truncate text ────────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "…";
}

// ─── Slugify ──────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
