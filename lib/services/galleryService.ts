import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const UPLOAD_BASE = process.env.UPLOAD_DIR ?? "./uploads";

// ─── Gallery Service ──────────────────────────────────────────────────────────

export async function getGalleries(clientId?: string) {
    return prisma.gallery.findMany({
        where: clientId ? { clientId } : undefined,
        include: {
            client: { include: { user: true } },
            files: { orderBy: { sortOrder: "asc" }, take: 1 }, // preview
            _count: { select: { files: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getGalleryById(id: string, includeFiles = true) {
    return prisma.gallery.findUnique({
        where: { id },
        include: {
            client: { include: { user: true } },
            files: includeFiles ? { orderBy: { sortOrder: "asc" } } : false,
        },
    });
}

export async function createGallery(data: {
    clientId: string;
    name: string;
    description?: string;
    password?: string;
    allowDownload?: boolean;
    expiresAt?: string;
}) {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : undefined;

    return prisma.gallery.create({
        data: {
            clientId: data.clientId,
            name: data.name,
            description: data.description,
            password: hashedPassword,
            allowDownload: data.allowDownload ?? true,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        },
    });
}

export async function uploadGalleryFile(
    galleryId: string,
    file: File,
    sortOrder = 0
) {
    const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
    if (!gallery) throw new Error("Gallery not found");

    // Ensure upload directory exists
    const galleryDir = join(UPLOAD_BASE, "galleries", galleryId);
    await mkdir(galleryDir, { recursive: true });

    // Store with UUID name to prevent enumeration
    const ext = file.name.split(".").pop() ?? "jpg";
    const storedName = `${uuidv4()}.${ext}`;
    const filePath = join(galleryDir, storedName);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return prisma.galleryFile.create({
        data: {
            galleryId,
            filename: file.name,
            storedName,
            path: `/galleries/${galleryId}/${storedName}`,
            mimeType: file.type,
            size: file.size,
            sortOrder,
        },
    });
}

export async function deleteGalleryFile(fileId: string) {
    const file = await prisma.galleryFile.findUnique({ where: { id: fileId } });
    if (!file) throw new Error("File not found");

    // Delete from disk
    const fullPath = join(UPLOAD_BASE, file.path);
    try {
        await unlink(fullPath);
    } catch {
        // Ignore if file already missing
    }

    return prisma.galleryFile.delete({ where: { id: fileId } });
}

export async function verifyGalleryPassword(galleryId: string, password: string) {
    const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
    if (!gallery) return false;
    if (!gallery.password) return true; // No password set
    return bcrypt.compare(password, gallery.password);
}
