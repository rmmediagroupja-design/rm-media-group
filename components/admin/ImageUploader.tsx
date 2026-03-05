"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    value: string; // The current image URL (if any)
    onChange: (url: string) => void;
    label?: string;
    aspectRatio?: "video" | "square" | "portrait" | "landscape" | "auto"; // Hints for the uploader
}

export function ImageUploader({ value, onChange, label = "Upload Image", aspectRatio = "auto" }: ImageUploaderProps) {
    const onUpload = (result: any) => {
        if (result.event === "success") {
            onChange(result.info.secure_url);
        }
    };

    return (
        <div className="space-y-4 w-full">
            {value ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#333] group bg-[#111]">
                    <div className="absolute inset-0 z-10 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                            title="Remove Image"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Uploaded preview"
                        className="object-cover w-full h-full"
                    />
                </div>
            ) : (
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rm_media"} // Optional preset fallback
                    signatureEndpoint="/api/upload"
                    onSuccess={onUpload}
                    options={{
                        multiple: false,
                        resourceType: "image",
                        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
                        maxFileSize: 10485760, // 10MB
                    }}
                >
                    {({ open }) => (
                        <div
                            onClick={() => open()}
                            className="w-full border-2 border-dashed border-[#333] hover:border-[#00D2B9] bg-[#111] hover:bg-[#1a1a1a] rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#222] group-hover:bg-[#00D2B9]/10 flex items-center justify-center mb-4 transition-colors">
                                <UploadCloud className="text-[#666] group-hover:text-[#00D2B9]" size={32} />
                            </div>
                            <span className="text-white font-medium mb-1">{label}</span>
                            <span className="text-xs text-[#666]">Click to upload or drag and drop</span>
                            <span className="text-[10px] text-[#444] mt-2 uppercase tracking-wide">SVG, PNG, JPG or WEBP (Max 10MB)</span>
                        </div>
                    )}
                </CldUploadWidget>
            )}
        </div>
    );
}
