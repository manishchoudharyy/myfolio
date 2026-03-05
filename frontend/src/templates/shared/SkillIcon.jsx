import React, { useState } from "react";

/**
 * Renders a skill icon from Simple Icons CDN.
 * Falls back to a styled letter badge if icon not found.
 *
 * CDN: https://cdn.simpleicons.org/{slug}
 * Icons available: React, Python, JavaScript, Node, etc.
 *
 * Usage: <SkillIcon name="React" size={28} />
 */

// Map common display names → simpleicons slug
const SLUG_MAP = {
    "javascript": "javascript",
    "js": "javascript",
    "typescript": "typescript",
    "ts": "typescript",
    "react": "react",
    "react.js": "react",
    "reactjs": "react",
    "next.js": "nextdotjs",
    "nextjs": "nextdotjs",
    "node.js": "nodedotjs",
    "nodejs": "nodedotjs",
    "node": "nodedotjs",
    "express": "express",
    "express.js": "express",
    "vue": "vuedotjs",
    "vue.js": "vuedotjs",
    "angular": "angular",
    "svelte": "svelte",
    "python": "python",
    "django": "django",
    "flask": "flask",
    "fastapi": "fastapi",
    "java": "java",
    "spring": "spring",
    "springboot": "springboot",
    "spring boot": "springboot",
    "kotlin": "kotlin",
    "swift": "swift",
    "c++": "cplusplus",
    "cpp": "cplusplus",
    "c#": "csharp",
    "csharp": "csharp",
    ".net": "dotnet",
    "dotnet": "dotnet",
    "go": "go",
    "golang": "go",
    "rust": "rust",
    "php": "php",
    "laravel": "laravel",
    "ruby": "ruby",
    "rails": "rubyonrails",
    "ruby on rails": "rubyonrails",
    "mongodb": "mongodb",
    "mysql": "mysql",
    "postgresql": "postgresql",
    "postgres": "postgresql",
    "redis": "redis",
    "firebase": "firebase",
    "supabase": "supabase",
    "graphql": "graphql",
    "docker": "docker",
    "kubernetes": "kubernetes",
    "k8s": "kubernetes",
    "aws": "amazonwebservices",
    "azure": "microsoftazure",
    "gcp": "googlecloud",
    "google cloud": "googlecloud",
    "git": "git",
    "github": "github",
    "linux": "linux",
    "nginx": "nginx",
    "tailwind": "tailwindcss",
    "tailwindcss": "tailwindcss",
    "css": "css3",
    "html": "html5",
    "sass": "sass",
    "figma": "figma",
    "tensorflow": "tensorflow",
    "pytorch": "pytorch",
    "pandas": "pandas",
    "numpy": "numpy",
    "openai": "openai",
};

function getSlug(name) {
    const lower = name?.toLowerCase()?.trim() || "";
    return SLUG_MAP[lower] || lower.replace(/[^a-z0-9]/g, "");
}

const SkillIcon = ({ name, size = 28, className = "" }) => {
    const [failed, setFailed] = useState(false);
    const slug = getSlug(name);
    const iconUrl = `https://cdn.simpleicons.org/${slug}`;

    if (failed || !slug) {
        // Fallback: styled letter badge
        return (
            <div
                className={`flex items-center justify-center rounded-lg font-bold text-white ${className}`}
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.45,
                    background: `hsl(${(name?.charCodeAt(0) || 0) * 17 % 360}, 65%, 45%)`,
                }}
            >
                {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
        );
    }

    return (
        <img
            src={iconUrl}
            alt={name}
            onError={() => setFailed(true)}
            className={className}
            style={{ width: size, height: size, objectFit: "contain" }}
        />
    );
};

export default SkillIcon;
