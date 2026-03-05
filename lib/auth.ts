import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    trustHost: true,
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) {
                    console.log("[AUTH] Login validation failed:", parsed.error.flatten());
                    return null;
                }

                const { email, password } = parsed.data;
                console.log("[AUTH] Login attempt for:", email.toLowerCase());

                const user = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() },
                    include: { client: true },
                });

                if (!user) {
                    console.log("[AUTH] User not found:", email.toLowerCase());
                    return null;
                }

                if (!user.active) {
                    console.log("[AUTH] User is inactive:", email.toLowerCase());
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    console.log("[AUTH] Invalid password for:", email.toLowerCase());
                    return null;
                }

                console.log("[AUTH] Login successful for:", email.toLowerCase(), "role:", user.role);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id || "";
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
