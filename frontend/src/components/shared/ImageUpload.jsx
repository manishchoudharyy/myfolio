import React, { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadAPI } from "../../services/api";

/**
 * Reusable image uploader component.
 * Uploads to Cloudinary via backend and returns a URL.
 *
 * Props:
 *   value       - current image URL (string)
 *   onChange    - called with new URL when upload success
 *   shape       - "circle" | "rect" (default: "rect")
 *   placeholder - text shown when empty
 *   className   - extra wrapper classes
 */
const ImageUpload = ({
    value,
    onChange,
    shape = "rect",
    placeholder = "Upload Image",
    className = "",
    aspectRatio = "aspect-video",
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Only image files allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be under 5 MB");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await uploadAPI.image(file);
            onChange(res.data.data.url);
        } catch (err) {
            setError("Upload failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const isCircle = shape === "circle";
    const shapeClass = isCircle
        ? "rounded-full w-28 h-28"
        : `rounded-xl w-full ${aspectRatio}`;

    return (
        <div className={`relative ${className}`}>
            <div
                className={`relative overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 transition-colors cursor-pointer ${shapeClass} flex items-center justify-center group`}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="uploaded"
                            className={`absolute inset-0 w-full h-full object-cover ${isCircle ? "rounded-full" : "rounded-xl"}`}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-xs font-medium">Change</p>
                        </div>
                    </>
                ) : loading ? (
                    <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-xs text-center px-2">{placeholder}</span>
                    </div>
                )}
            </div>

            {/* Remove button */}
            {value && !loading && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange("");
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 shadow-sm transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}

            {/* Error */}
            {error && (
                <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
            />
        </div>
    );
};

export default ImageUpload;
