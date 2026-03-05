export function sanitizeUrl(url) {
    if (!url) return "#";
    try {
        const parsed = new URL(url, window.location.origin);
        // Allow ONLY safe protocols to prevent XSS (like javascript:)
        if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
            return url;
        }
    } catch {
        // If it's a relative path starting with / or #, it's generally safe
        if (url.startsWith("/") || url.startsWith("#")) return url;
    }
    // Fallback for dangerous URLs like javascript:alert(1)
    return "#";
}
