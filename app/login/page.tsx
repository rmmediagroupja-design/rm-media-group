"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";

const schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await signIn("credentials", {
                email: data.email.toLowerCase(),
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                // Redirect based on role is handled by middleware  
                router.refresh();
                router.push("/admin");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#080808] px-6 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle at 50% 50%, #00D2B9 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-12">
                    <span
                        className="text-[#00D2B9] font-bold text-2xl tracking-[0.25em] uppercase block mb-2"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        RM MEDIA GROUP JA
                    </span>
                    <span className="text-[#444] text-xs tracking-[0.2em] uppercase">Client & Staff Portal</span>
                </div>

                <div className="card-luxury p-8 lg:p-10">
                    <h1
                        className="text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Sign In
                    </h1>
                    <p className="text-[#666] text-sm mb-8">Enter your credentials to access your account.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                autoComplete="email"
                                placeholder="your@email.com"
                                className="input-luxury"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-[#666] tracking-[0.1em] uppercase mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="input-luxury pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#a0a0a0]"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded p-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-cyan w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in…" : "Sign In"}
                            {!loading && <LogIn size={16} />}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[#444] text-xs mt-6">
                    <a href="/" className="hover:text-[#666] transition-colors">← Back to website</a>
                </p>
            </div>
        </div>
    );
}
