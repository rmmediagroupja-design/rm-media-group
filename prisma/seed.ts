import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // ─── Admin user ───────────────────────────────────────────────────────────
    const adminExists = await prisma.user.findUnique({ where: { email: "admin@rmmediagroup.com" } });
    if (!adminExists) {
        await prisma.user.create({
            data: {
                name: "RM Admin",
                email: "admin@rmmediagroup.com",
                password: await bcrypt.hash("RMMedia2024!", 12),
                role: "ADMIN",
            },
        });
        console.log("✅ Admin user created: admin@rmmediagroup.com / RMMedia2024!");
    } else {
        console.log("ℹ️  Admin user already exists.");
    }

    // ─── Sample staff user ─────────────────────────────────────────────────────
    const staffExists = await prisma.user.findUnique({ where: { email: "staff@rmmediagroup.com" } });
    if (!staffExists) {
        await prisma.user.create({
            data: {
                name: "RM Staff",
                email: "staff@rmmediagroup.com",
                password: await bcrypt.hash("RMStaff2024!", 12),
                role: "STAFF",
            },
        });
        console.log("✅ Staff user created: staff@rmmediagroup.com / RMStaff2024!");
    }

    // ─── Sample client ─────────────────────────────────────────────────────────
    const clientUserExists = await prisma.user.findUnique({ where: { email: "client@example.com" } });
    if (!clientUserExists) {
        await prisma.user.create({
            data: {
                name: "Jane Smith",
                email: "client@example.com",
                password: await bcrypt.hash("Client2024!", 12),
                role: "CLIENT",
                client: {
                    create: {
                        phone: "+1 (876) 555-0100",
                        company: "Smith Events",
                        city: "Kingston",
                        country: "Jamaica",
                    },
                },
            },
        });
        console.log("✅ Sample client created: client@example.com / Client2024!");
    }

    // ─── Sample leads ──────────────────────────────────────────────────────────
    const leadCount = await prisma.lead.count();
    if (leadCount === 0) {
        await prisma.lead.createMany({
            data: [
                {
                    name: "Marcus Brown",
                    email: "marcus@example.com",
                    phone: "+1 (876) 555-0200",
                    source: "contact_form",
                    serviceInterest: "WEDDING",
                    status: "NEW",
                    message: "Looking for wedding photography for March 2025.",
                    eventDate: new Date("2025-03-15"),
                    budget: 2500,
                },
                {
                    name: "Kezia Thompson",
                    email: "kezia@example.com",
                    phone: "+1 (876) 555-0300",
                    source: "booking_form",
                    serviceInterest: "PORTRAIT",
                    status: "CONTACTED",
                    message: "Need professional headshots for my business.",
                    budget: 500,
                },
                {
                    name: "Devon Clarke",
                    email: "devon@example.com",
                    source: "social",
                    serviceInterest: "SOCIAL_MEDIA",
                    status: "QUOTED",
                    message: "Interested in social media management package.",
                    budget: 800,
                },
            ],
        });
        console.log("✅ Sample leads created.");
    }

    // ─── Sample marketing client ───────────────────────────────────────────────
    const admin = await prisma.user.findUnique({ where: { email: "admin@rmmediagroup.com" } });
    const marketingCount = await prisma.marketingClient.count();
    if (marketingCount === 0 && admin) {
        await prisma.marketingClient.create({
            data: {
                userId: admin.id,
                businessName: "Devon's Boutique",
                contactName: "Devon Clarke",
                email: "devon@example.com",
                phone: "+1 (876) 555-0301",
                package: "STANDARD",
                monthlyFee: 800,
                startDate: new Date("2024-01-01"),
                renewalDate: new Date("2025-01-01"),
                instagram: "@devonsboutique",
                active: true,
            },
        });
        console.log("✅ Sample marketing client created.");
    }

    // ─── Site Settings ────────────────────────────────────────────────────────
    const settingsExists = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!settingsExists) {
        await prisma.siteSettings.create({
            data: {
                id: "default",
                siteName: "RM Media Group JA",
                contactEmail: "info@rmmediagroupja.art",
                contactPhone: "+1 (876) 555-0199",
                instagram: "https://instagram.com/rmmediagroupja",
            },
        });
        console.log("✅ Site settings initialized.");
    }

    // ─── Site Content (Home) ──────────────────────────────────────────────────
    const homeContentCount = await prisma.siteContent.count({ where: { page: "home" } });
    if (homeContentCount === 0) {
        await prisma.siteContent.createMany({
            data: [
                {
                    page: "home",
                    section: "hero",
                    key: "title",
                    content: "Photography is,Poetry.",
                },
                {
                    page: "home",
                    section: "hero",
                    key: "subtitle",
                    content: "Jamaica's premier photography, videography, and social media agency — crafting cinematic moments that last a lifetime.",
                },
                {
                    page: "home",
                    section: "hero",
                    key: "imageUrl",
                    content: "https://images-pw.pixieset.com/site/gley00/yQAy6Z/DSCF2058_e1baadd3_2048.jpg",
                },
            ],
        });
        console.log("✅ Home content initialized.");
    }

    // ─── Site Content (About) ─────────────────────────────────────────────────
    const aboutContentCount = await prisma.siteContent.count({ where: { page: "about" } });
    if (aboutContentCount === 0) {
        await prisma.siteContent.createMany({
            data: [
                {
                    page: "about",
                    section: "hero",
                    key: "title",
                    content: "Behind The Lens",
                },
                {
                    page: "about",
                    section: "hero",
                    key: "subtitle",
                    content: "Born in Jamaica, built on passion. RM Media Group JA has been telling visual stories that resonate, inspire, and endure.",
                },
                {
                    page: "about",
                    section: "hero",
                    key: "imageUrl",
                    content: "https://images-pw.pixieset.com/site/gley00/5ylE7p/DSC_0042_030f432c_2048.jpg",
                },
            ],
        });
        console.log("✅ About content initialized.");
    }

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
