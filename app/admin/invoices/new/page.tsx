"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

const itemSchema = z.object({
    description: z.string().min(1, "Required"),
    quantity: z.number().min(0.01, "Must be > 0"),
    unitPrice: z.number().min(0, "Must be >= 0"),
});

const schema = z.object({
    clientId: z.string().min(1, "Client is required"),
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    taxRate: z.number().min(0).max(100).optional(),
    discount: z.number().min(0).optional(),
    notes: z.string().optional(),
    items: z.array(itemSchema).min(1, "At least one item is required"),
});

type FormData = z.infer<typeof schema>;

export default function NewInvoiceForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            items: [{ description: "", quantity: 1, unitPrice: 0 }],
            taxRate: 15,
            discount: 0,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchItems = watch("items");
    const watchTax = watch("taxRate") || 0;
    const watchDiscount = watch("discount") || 0;

    const subtotal = watchItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const discountAmount = subtotal * (watchDiscount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (watchTax / 100);
    const total = subtotalAfterDiscount + taxAmount;

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    dueDate: new Date(data.dueDate).toISOString(),
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to create invoice");
            }

            router.push("/admin/invoices");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        New Invoice
                    </h1>
                    <p className="text-[#666] text-sm mt-1">Bill a client for services.</p>
                </div>
                <Link href="/admin/invoices" className="btn-secondary text-xs">
                    Cancel
                </Link>
            </div>

            <div className="card-luxury p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Header Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Client ID</label>
                            <input
                                {...register("clientId")}
                                placeholder="Enter Client ID"
                                className="input-luxury w-full"
                            />
                            {errors.clientId && <p className="text-red-400 text-xs mt-1">{errors.clientId.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Invoice Title</label>
                            <input
                                {...register("title")}
                                placeholder="e.g. Wedding Package Final Payment"
                                className="input-luxury w-full"
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Due Date</label>
                            <input
                                type="date"
                                {...register("dueDate")}
                                className="input-luxury w-full"
                            />
                            {errors.dueDate && <p className="text-red-400 text-xs mt-1">{errors.dueDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Brief Description</label>
                            <input
                                {...register("description")}
                                placeholder="Optional subtitle for client..."
                                className="input-luxury w-full"
                            />
                        </div>
                    </div>

                    <hr className="border-[#222]" />

                    {/* Line Items */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-white">Line Items</h3>
                            <button
                                type="button"
                                onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                                className="text-[#00D2B9] hover:text-white text-sm flex items-center gap-1 transition-colors"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start bg-[#111] p-4 rounded border border-[#222]">
                                    <div className="flex-1">
                                        <label className="block text-xs text-[#666] mb-1">Description</label>
                                        <input
                                            {...register(`items.${index}.description` as const)}
                                            placeholder="Item detail..."
                                            className="input-luxury w-full py-2"
                                        />
                                        {errors.items?.[index]?.description && (
                                            <p className="text-red-400 text-xs mt-1">{errors.items[index]?.description?.message}</p>
                                        )}
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs text-[#666] mb-1">Qty</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                                            className="input-luxury w-full py-2"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-xs text-[#666] mb-1">Unit Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                                            className="input-luxury w-full py-2"
                                        />
                                    </div>
                                    <div className="w-32 pt-6">
                                        <div className="h-10 flex items-center justify-end font-medium text-white px-3 bg-[#1a1a1a] rounded">
                                            ${((watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0)).toFixed(2)}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        className="pt-8 text-[#666] hover:text-red-400 disabled:opacity-30 disabled:hover:text-[#666] transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-[#222]" />

                    {/* Totals & Notes */}
                    <div className="flex gap-12">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">Invoice Notes (Visible to Client)</label>
                                <textarea
                                    {...register("notes")}
                                    rows={4}
                                    placeholder="Thank you for your business..."
                                    className="input-luxury w-full min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div className="w-72 space-y-4">
                            <div className="flex items-center justify-between text-sm text-[#a0a0a0]">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-[#a0a0a0]">
                                <span className="flex-1 whitespace-nowrap">Discount %</span>
                                <input
                                    type="number"
                                    max="100"
                                    {...register("discount", { valueAsNumber: true })}
                                    className="input-luxury w-20 py-1 text-right text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-4 text-sm text-[#a0a0a0]">
                                <span className="flex-1 whitespace-nowrap">Tax (GCT) %</span>
                                <input
                                    type="number"
                                    max="100"
                                    {...register("taxRate", { valueAsNumber: true })}
                                    className="input-luxury w-20 py-1 text-right text-xs"
                                />
                            </div>

                            <hr className="border-[#333]" />

                            <div className="flex items-center justify-between text-lg font-bold text-[#00D2B9]">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                        <button type="submit" disabled={loading} className="btn-cyan min-w-[200px] justify-center py-3">
                            {loading ? "Generating..." : "Generate Invoice"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
